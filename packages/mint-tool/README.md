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
