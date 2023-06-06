import { useEffect } from "react";
import { NFTGrid } from "~~/components/NFTGrid";
const axios = require('axios');

export const PlayerNFTs = ({ address, coin_image, icon_align }: { address: string; coin_image: string; icon_align: string }) => {
    let displayAddress = address?.slice(0, 5) + "..." + address?.slice(-4);

    const imageUrl = `/${coin_image}`;


    const ownerAddress = '0xbb59c2ad6083A2DA55972Fc1Bde73509Dcb062F1';
    const apiKey = '65aadccdd36f4f03a909e88251029cd4';

    const raribleAPIKey = "313808b2-613e-4a10-9476-76bf71ab406d";
    const raribleBaseURL = "https://testnet-api.rarible.org/v0.1"
    const ownershipQuery = "/ownerships/"

    const ownershipId = "ETHEREUM:0x6972347e66a32f40ef3c012615c13cb88bf681cc:71481372648203575558993015318897331386170125774163974705671968549417949069313:0x9e0905eedceb26dbabde0d72b86a4a88e323959a"
    
    //QUERY NFTs of the user!

    // //goerli api: https://testnets-api.opensea.io/api/v1/assets?owner=${ownerAddress}
    // // --url 'https://testnets-api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=20&include_orders=false'
    // useEffect(() => {
    //     // fetch(`https://api.opensea.io/api/v1/assets?owner=${ownerAddress}`, {
    //     // // fetch(`https://testnets-api.opensea.io/api/v1/assets?owner=${ownerAddress}`, {
    //     //     headers: {
    //     //         'X-API-KEY': apiKey,
    //     //     },
    //     // })
    //     fetch(raribleBaseURL+ownershipQuery+ownershipId, {
    //     // fetch(`https://testnets-api.opensea.io/api/v1/assets?owner=${ownerAddress}`, {
    //         headers: {
    //             'X-API-KEY': raribleAPIKey,
    //         },
    //     })
    //     .then((response) => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then((data) => {
    //         // Handle the API response
    //         const nfts = data.assets;
    //         // Process and display the NFTs owned by the wallet address
    //         console.log("NFTs fetched from the opensea: ", nfts);
    //     })
    //     .catch((error) => {
    //         // Handle any errors
    //         console.error('Error fetching NFTs:', error);
    //     });
    // }, [])

    const nfts = [
        {
            imageUrl: imageUrl,
            selected: false,
        },
        {
            imageUrl: imageUrl,
            selected: false,
        },
        {
            imageUrl: imageUrl,
            selected: false,
        },
        {
            imageUrl: imageUrl,
            selected: false,
        },
        {
            imageUrl: imageUrl,
            selected: false,
        },
        {
            imageUrl: imageUrl,
            selected: false,
        },
        {
            imageUrl: imageUrl,
            selected: false,
        },
        {
            imageUrl: imageUrl,
            selected: false,
        },
        {
            imageUrl: imageUrl,
            selected: false,
        },
        {
            imageUrl: imageUrl,
            selected: false,
        }
    ]

    return (
        <div className="flex flex-col pt-3 justify-center items-center">
            <div style={{width: "100%"}} className="pl-2 pr-2">
                <div className={icon_align}>
                    <img src={imageUrl} className="w-12"/>
                </div>
            </div>
            <div>{displayAddress}</div>
            <NFTGrid nfts={nfts}></NFTGrid>
        </div>
    );
};
