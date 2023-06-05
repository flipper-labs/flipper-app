// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";

contract Flipper is Ownable, IERC721Receiver, VRFV2WrapperConsumerBase {
    event MatchCreated(string indexed id, address creator, uint256 timestamp);
    event MatchCompleted(string indexed id, address winner, uint256 timestamp);
    event MatchAbandoned(string indexed id, uint256 timestamp);

    struct Match {
        uint256 timestamp;
        address player1;
        NFT[] player1Stake;
        address player2;
        NFT[] player2Stake;
        address winner;
        string gamemode;
        bool isSettled;
    }

    struct NFT {
        address contractAddress;
        uint id;
    }

    mapping(string => Match) public matches;
    mapping(uint256 => string) public randomnessRequestsRequestToMatch;
    mapping(string => uint256) public randomnessRequestsMatchToRequest;
    mapping(string => uint256[]) public matchesRandomness;

    uint256 private matchStartWindow; // Window of time for players to start the match. If this time passes, users are able to claim their locked NFTs and match cannot be started.
    uint32 private callbackGasLimit;

    constructor(address _link, address _vrfV2Wrapper, uint32 _callbackGasLimit, uint256 _matchStartWindow) VRFV2WrapperConsumerBase(_link, _vrfV2Wrapper) {
        callbackGasLimit = _callbackGasLimit;
        matchStartWindow = _matchStartWindow;
    }

    modifier checkNFTs(address player, NFT[] memory tokens) {
        require(tokens.length > 0, "checkNFTs: player must stake at least 1 NFT.");
        require(_checkTokensOwner(player, tokens), "checkNFTs: player does not own specified NFTs.");
        _;
    }

    /**
     * @dev Initializes a match, locks users' tokens and requests randomness from Chainlink's VRF,
     * which will be used for determining a winner.
     *
     * Emits a {MatchCreated} event.
     */
    function createMatch(string calldata matchId, Match memory _match) 
        external
        checkNFTs(_match.player1, _match.player1Stake)
        checkNFTs(_match.player2, _match.player2Stake){

        // Create a match
        Match storage newMatch = matches[matchId];
        newMatch.timestamp = block.timestamp;

        newMatch.player1 = _match.player1;
        for(uint i = 0; i < _match.player1Stake.length; i++){
            newMatch.player1Stake.push(_match.player1Stake[i]);
        }

        newMatch.player2 = _match.player2;
        for(uint i = 0; i < _match.player2Stake.length; i++){
            newMatch.player2Stake.push(_match.player2Stake[i]);
        }

        newMatch.winner = address(0);
        newMatch.gamemode = _match.gamemode;

        emit MatchCreated(matchId, newMatch.player1, block.timestamp);
    }

    /**
     * @dev Allows players to start the match. Match can be started only by the players themselves and if they both locked tokens they agreed upon.
     */
    function startMatch(string calldata matchId) external {
        Match memory _match = matches[matchId];

        require(!_match.isSettled, "startMatch: the match has already been settled.");
        require(msg.sender == _match.player1 || msg.sender == _match.player2, "startMatch: only players can start the match.");

        require(_checkTokensOwner(address(this), _match.player1Stake), "startMatch: contract is not the owner of tokens that player 1 should've staked.");
        require(_checkTokensOwner(address(this), _match.player2Stake), "startMatch: contract is not the owner of tokens that player 2 should've staked.");

        // Reach out to VRF contract
        uint256 requestId = requestRandomness(callbackGasLimit, 3, 1); // TODO: Modify last param (_numWords) based on the gamemode 

        // Maps VRF request to a match, so that it can be identified in the VRF callback.
        randomnessRequestsRequestToMatch[requestId] = matchId;
        randomnessRequestsMatchToRequest[matchId] = requestId;
    }

    /**
     * @dev Receives random numbers from Chainlink's VRF V2.
     * 
     * Note/TODO: This is VRF V2 using "direct funding" method. Perhaps we want to go with a "subscription" method,
     * so we can fund an account we specify on the Chainlink's website, instead of funding the contract directly.
     */
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        string memory matchId = randomnessRequestsRequestToMatch[requestId];
        Match storage _match = matches[matchId];

        matchesRandomness[matchId] = randomWords; // store randomness results, maybe it will be needed for on-chain proofs

        delete randomnessRequestsMatchToRequest[matchId];
        delete randomnessRequestsRequestToMatch[requestId];

        completeMatch(matchId, _match);
    }

    /**
     * @dev Completes a match and triggers match prize settlement.
     *
     * Emits a {MatchCompleted} event.
     */
    function completeMatch(string memory matchId, Match storage _match) internal {
        require(matchesRandomness[matchId].length > 0, "completeMatch: no random number has been returned.");

        uint256 randomNumber = matchesRandomness[matchId][0];

        // TODO: Perhaps extract determination logic and make it more modular/extensible with proxies.
        if(randomNumber % 2 == 0) {
            _match.winner = _match.player1;
        }else{
            _match.winner = _match.player2;
        }

        _transferNFTs(address(this), _match.winner, _match.player1Stake);
        _transferNFTs(address(this), _match.winner, _match.player2Stake);

        _match.isSettled = true;

        emit MatchCompleted(matchId, _match.winner, block.timestamp);
    }


    /**
     * @dev Allow users to claim their tokens after the match start window has passed.
     *
     * Emits a {MatchAbandoned} event.
     */
    function claimTokens(string calldata matchId) external {
        Match storage _match = matches[matchId]; 

        require(msg.sender == _match.player1 || msg.sender == _match.player2, "claimTokens: only players themselves can claim their tokens.");
        require(block.timestamp - _match.timestamp >= matchStartWindow, "claimTokens: match start window has not passed yet.");

        if(msg.sender == _match.player1) {
            _transferNFTs(address(this), _match.player1, _match.player1Stake);
        }else if(msg.sender == _match.player2) {
            _transferNFTs(address(this), _match.player2, _match.player2Stake);
        }
              
        if(!_match.isSettled){
            _match.isSettled = true;
            emit MatchAbandoned(matchId, block.timestamp);
        }
    }

    /**
     * @dev Transfer NFTs from one to another address, if sender owns them.
     */
    function _transferNFTs(address from, address to, NFT[] storage tokens) internal {
        for(uint i = 0; i < tokens.length; i++){
            if(_isOwner(from, tokens[i].contractAddress, tokens[i].id)) {
                IERC721(tokens[i].contractAddress).safeTransferFrom(from, to, tokens[i].id);
            }
        }
    }

    /**
     * @dev Check whether certain user owns specified NFTs.
     */
    function _checkTokensOwner(address owner, NFT[] memory tokens) internal view returns (bool) {
        for(uint i = 0; i < tokens.length; i++){
            if(!_isOwner(owner, tokens[i].contractAddress, tokens[i].id)) return false;
        }

        return true;
    }

    function _isOwner(address owner, address contractAddress, uint tokenId) internal view returns (bool) {
        return IERC721(contractAddress).ownerOf(tokenId) == owner;
    }

    function setMatchStartWindow(uint256 _window) external onlyOwner {
        matchStartWindow = _window;
    }

    function setCallbackGasLimit(uint32 _limit) external onlyOwner {
        callbackGasLimit = _limit;
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
      return IERC721Receiver.onERC721Received.selector;
    }
}