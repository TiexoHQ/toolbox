## Who we are
We are known in the blockchain ecosystem as [Moonlet](https://moonlet.io) Team, a non-custodial digital asset wallet and a node operator for several blockchain networks, and being able to build an NFT marketplace is something we have set out to achieve for some time. We are really excited join the NFT movement and build [TIEXO](https://tiexo.com).

Our main goal is to build a generative NFT art toolbox in order to help artists launch large collections. Basically we would like to offer a new set of tools and simplified processes to make the generative NFT art a few clicks away. Please find below more details about how you can run locally our project.


## Getting Started

First, run the development server:

```bash
# Install dependencies (yarn is needed as yarn workspaces are used)
yarn

# Run
npm run dev-mint-tool
# or
yarn dev-mint-tool
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

From the main page select `Open test project` button, this will populate the app with test data

## App overview

**Note**: At this point the application is running all the code in users browser, no API involved yet. It stores some data in localstorage. The generation algorithm is executed in a web worker, for large collections (~10k NFTs) and complex generation rules execution time can be over 1-2mins. 

At the top of the page there are two buttons:
* `Generate` - this will trigger the algorithm
* `Load other` - load other data, currently there is only one test data

Tabs:
* `Attributes` - Visualize all possbile values for the nft, grouped by each layer, if a layer should not be present in final result => check **Allow undefined**

* `Mixer` - Playground where you can mix the NFTs
* `Settings`
    * `General`

        **NFT count** - number of NFTs to be generated

        **Random seed** - using this on successive runs the algorithm will return same results, if no settings are changed

        **Max tries** - maximim number of tries for the algorithm to find the final results to prevent infinite loop (usually can be set to 3 * **Nft count**)

    * `Compatibility`

        Set of rules that can be used to define the compatibility between certain attributes
    * `Targets`

        **Rarity** - can define number of NFTs that should be generated with a certain rarity score and certain number of attributes

        **Attribute occurence** - adjust the number of occurence for a specific attribute

* `Preview`
    
    The results of the algoritm will be shown here

## What's next

The current form is just a proof of concept, but in the next period we will extend the tool, our goal is to help artists publish their art without interacting with code or cli.

Short term goals:
- add a backend component
- save information about collections in our database
- let artists add multiple collections and manage them in parallel 
- make nft mixer follow attribute compatibility rules
- an option to update compatibility rules from nft mixer
- make generation settings UI more friendly, and add helping texts so artists understand what are doing
- improve generation algorithm:
    - implement a way to stop the execution
    - add a progress bar on UI
    - ability to run the algorithm in cloud, maybe a serverless function
    - ability to run the algorithm multiple times while keeping previously generated nfts
- improve Preview functionality:
    - add more information about an nft (attributes info, rarity score, rank)
    - ability to mark an nft as invalid
- add export feature, to export the collection for candy machine use

Long term goals: 
- improve the tool so the artists could generate nfts, mint them or create candy machine and after the collection is live to view stats about the collection.
- we would like also to launch the mobile app suite and leverage what we currently have build within Moonlet.

## Where to find us
🌟 Follow us: https://twitter.com/tiexohq

🌟 Visit our website: https://tiexo.com/

🌟 Join our Discord: _Coming Soon_

🌟 Check our profile: https://www.instagram.com/tiexohq/
