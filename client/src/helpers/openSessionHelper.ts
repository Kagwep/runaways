import { HelloWorld } from "../config/constants";
import { DappKey } from "@argent/x-sessions";
import { ec } from "starknet";
import { parseUnits } from "./token";

const ETHFees = [
  {
    tokenAddress: "0x019c74893C2e763C379f440F5787bD1078d5a84F9D8eb8C365b0008adB89a8d8",
    maxAmount: parseUnits("0.1", 18).value.toString(),
  },
];

const STRKFees = [
  {
    tokenAddress: "0x019c74893C2e763C379f440F5787bD1078d5a84F9D8eb8C365b0008adB89a8d8",
    maxAmount: "10000000000000000",
  },
  {
    tokenAddress: "0x019c74893C2e763C379f440F5787bD1078d5a84F9D8eb8C365b0008adB89a8d8",
    maxAmount: "200000000000000000000",
  },
];

const allowedMethods = [
  {
    "Contract Address": HelloWorld,
    selector: "increase_balance",
  },
];

const expiry = Math.floor((Date.now() + 1000 * 60 * 60 * 24) / 1000) as any;

const metaData = (isStarkFeeToken: boolean) => ({
  projectID: "test-dapp",
  txFees: isStarkFeeToken ? STRKFees : ETHFees,
});

const privateKey = ec.starkCurve.utils.randomPrivateKey();

const dappKey: DappKey = {
  privateKey,
  publicKey: ec.starkCurve.getStarkKey(privateKey),
};

export { allowedMethods, dappKey, expiry, metaData };
