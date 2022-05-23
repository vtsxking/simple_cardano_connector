# Simple Cardano Connector

## Description
The main idea for this was to create a simple way to add cardano wallet support to simple static sites as most existing Dapp connectors require some sort of backend runtime enviroment like node. The goal was to make this project as simple and wasy to use as possible.

## Usage
To use this project on any simple webpage you simply add the following to your html `<script type="text/javascript" src="simplified.js"></script>` you then should have access to any of the predefined functions like `returnWallets`, `getWalletAddress`, `selectWallet`, `getWalletSpeificAssets`, `getWalletSpeificAssetAmount` if you require further information please view this [example](https://github.com/vtsxking/simple_cardano_connector/blob/main/example/assets/js/main.js)

## Build
As you probably will want to, you can add your own functions and rebundle them into the simpilified js file. To do so ensure you have all the required modules installed if not already you should just be able to run `npm install` but incase that failes you can mannually add them like so:
`npm install browserify esmify`
`npm install @emurgo/cardano-serialization-lib-asmjs`

once isntalled add the desired functions to `src/index.js` and run `browserify -p esmify src/index.js -o output/simplified.js`.

## Todo
This was poorly created in a spur of the moment thing. So a lot needs to be done.

- Remove Node Modules from repo
- Refactor index to better reflect ES6 conventions
- Add transaction building
- Refactor functions to include less unnecessary code