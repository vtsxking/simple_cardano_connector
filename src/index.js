import "@emurgo/cardano-serialization-lib-asmjs/cardano_serialization_lib_bg"
import "@emurgo/cardano-serialization-lib-asmjs/cardano_serialization_lib.asm"
import "buffer"
import * as wasm from "@emurgo/cardano-serialization-lib-asmjs/cardano_serialization_lib";



window.getWallet = function() {
  window.cardano.enable().then((a) => {
    console.log(a);
    // Get Address
    window.cardano.getUsedAddresses().then((res) => {
      const addr = wasm.Address.from_bytes(Buffer.from(res[0], 'hex'));
      console.log("addr: \""+addr.to_bech32()+"\"");
  });
});
}

window.returnWallets = function() {
let wallet_arr = []
if (window?.cardano?.nami != undefined)
  wallet_arr.push(window?.cardano?.nami)
if (window?.cardano?.eternl != undefined)
  wallet_arr.push(window?.cardano?.eternl)
if (window?.cardano?.flint != undefined)
  wallet_arr.push(window?.cardano?.flint)
if (window?.cardano?.yoroi != undefined)
  wallet_arr.push(window?.cardano?.yoroi)
if (window?.cardano?.typon != undefined)
  wallet_arr.push(window?.cardano?.typon)
//console.log(wallet_arr)
return wallet_arr
}

window.enableWallet = async function(wallet) {
console.log("enable wallet")
let x = await wallet.isEnabled()
let myWallet = undefined
myWallet = new Promise(function(resolve, reject) {
  if (x == false) {
    wallet.enable().then((res) => {
      resolve(wallet)
    })
  }
  else {
    myWallet = resolve(wallet)
  }
})
console.log(myWallet)
return myWallet
}

window.getWalletAddress = async function(wallet) {
const mywallet = await wallet;
const api = await mywallet.enable();
let addr = "";
let walletAddress = undefined;
walletAddress = new Promise(function(resolve, reject) {
  if (mywallet.name == "Nami") {
    api.getUsedAddresses().then((res) => {
      addr = wasm.Address.from_bytes(Buffer.from(res[0], 'hex'));
      console.log("addr: \""+addr.to_bech32()+"\"");
      resolve(addr.to_bech32())
    });
  }
  else {
    api.getUnusedAddresses().then((res) => {
      addr = wasm.Address.from_bytes(Buffer.from(res[0], 'hex'));
      console.log("addr: \""+addr.to_bech32()+"\"");
      resolve(addr.to_bech32())
    })
  }
});
return walletAddress
}

window.selectWallet = function(wallet) {
let wallets = returnWallets()
for (let i = 0; i < wallets.length; i++) {
  if (wallets[i].name == wallet) {
    if (wallets[i].isEnabled() == false) {
      console.log(wallets[i])
      wallets[i].enable().then((res) => {
        return res
      });
    }
    else {
      return wallets[i]
    }
  }
}
}

function hexToAscii(str1)
{
let hex  = str1.toString();
let str = '';
for (let n = 0; n < hex.length; n += 2) {
  str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
}
return str;
}

window.getWalletSpeificAssets = async function(wallet, policy_id) {
const mywallet = await wallet
const api = await mywallet.enable()
const rawBalance = await api.getBalance()
let owned_nfts = []
let nfts = []
let value = wasm.Value.from_bytes(Buffer.from(rawBalance, 'hex'))
let balance_str_raw = parseInt(value.coin().to_str()) / 1000000
if (value.multiasset()) {
  const multiAssets = value.multiasset().keys()
  console.log(multiAssets.len())
  for (let i = 0; i < multiAssets.len(); i++) {
    console.log(i)
    const policy = multiAssets.get(i)
    const policyAssets = value.multiasset().get(policy)
    console.log("policy: "+multiAssets)
    const assetNames = policyAssets.keys()
    for (let k = 0; k < assetNames.len(); k++) {
      console.log("asset: "+assetNames.get(k))
      const policyAsset = assetNames.get(k)
      const quantity = policyAssets.get(policyAsset)
      const asset = Buffer.from(policy.to_bytes(), 'hex').toString('hex') + Buffer.from(policyAsset.name(), 'hex').toString('hex')
      const _policy = asset.slice(0, 56)
      const _name = asset.slice(56)
      console.log(_policy)
      console.log(_name)
      if(policy_id == _policy) {
        nfts.push({
          unit: asset,
          quantity: quantity.to_str(),
          policy: _policy,
          name: nft_name,
          fingerprint: null,
        });
        owned_nfts.push(nft_name)
      }
    }
    console.log(owned_nfts)
  }
}
return owned_nfts
}

window.getWalletSpeificAssetAmount = async function(wallet, policy_id) {
const mywallet = await wallet
const api = await mywallet.enable()
const rawBalance = await api.getBalance()
let owned_nfts = []
let nfts = []
let value = wasm.Value.from_bytes(Buffer.from(rawBalance, 'hex'))
let balance_str_raw = parseInt(value.coin().to_str()) / 1000000
if (value.multiasset()) {
  const multiAssets = value.multiasset().keys()
  for (let i = 0; i < multiAssets.len(); i++) {
    const policy = multiAssets.get(i)
    const policyAssets = value.multiasset().get(policy)
    const assetNames = policyAssets.keys()
    for (let k = 0; k < assetNames.len(); k++) {
      const policyAsset = assetNames.get(k)
      const quantity = policyAssets.get(policyAsset)
      const asset = Buffer.from(policy.to_bytes(), 'hex').toString('hex') + Buffer.from(policyAsset.name(), 'hex').toString('hex')
      const _policy = asset.slice(0, 56)
      const _name = asset.slice(56)
      if(policy_id == _policy) {
        return parseInt(quantity.to_str());
      }
    }
  }
}
}
