import { CONTRACT_ABI } from "../config/config";
import { ARGENT_SESSION_SERVICE_BASE_URL, HelloWorld, provider } from "../config/constants";
import { dappKey } from "../helpers/openSessionHelper";
import { Status } from "../helpers/status";
import { parseInputAmountToUint256 } from "../helpers/token";
// import { OffChainSession, SignSessionError, buildSessionAccount } from "@argent/x-sessions";
import { FC, useState } from "react";
import { Abi, Contract, Signature, stark } from "starknet";
import { OffChainSession } from "./sessionTypes";
import { SignSessionError } from "./errors";
import { buildSessionAccount } from "./utils";



interface SessionKeysExecuteProps {
  address: string;
  accountSessionSignature?: string[] | Signature;
  sessionRequest?: OffChainSession;
  setTransactionStatus: (status: Status) => void;
  setLastTransactionHash: (tx: string) => void;
  transactionStatus: Status;
}

const SessionKeysExecute: FC<SessionKeysExecuteProps> = ({
  address,
  accountSessionSignature,
  sessionRequest,
  setTransactionStatus,
  transactionStatus,
  setLastTransactionHash,
}) => {
  const [amount, setAmount] = useState<string>("");
  const buttonsDisabled = ["approve", "pending"].includes(transactionStatus) || !accountSessionSignature;
  const [error, setError] = useState<string | null>(null);

  const submitSessionTransaction = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setTransactionStatus("pending");
      if (!accountSessionSignature || !sessionRequest) {
        throw new Error("No open session");
      }

      // this could be stored instead of creating each time
      const sessionAccount = await buildSessionAccount({
        accountSessionSignature: stark.formatSignature(accountSessionSignature),
        sessionRequest,
        provider,
        chainId: await provider.getChainId(),
        address,
        dappKey,
        argentSessionServiceBaseUrl: ARGENT_SESSION_SERVICE_BASE_URL,
      });

      console.log(sessionAccount)

      const contract = new Contract(CONTRACT_ABI as Abi, HelloWorld, sessionAccount as any);

      console.log(contract)
      // https://www.starknetjs.com/docs/guides/use_erc20/#interact-with-an-erc20
      // check .populate
      const transferCallData = contract.populate("increase_balance", {
        amount: amount,
      });

      // https://www.starknetjs.com/docs/guides/estimate_fees/#estimateinvokefee
      const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
        contractAddress: HelloWorld,
        entrypoint: "increase_balance",
        calldata: transferCallData.calldata,
      });

      console.log(suggestedMaxFee)

      // https://www.starknetjs.com/docs/guides/estimate_fees/#fee-limitation
      const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10);
      // send to same account

      console.log(maxFee)

      console.log(transferCallData.calldata) 

      const result = await contract.increase_balance(transferCallData.calldata, {
        maxFee,
      });

      console.log(result)

      setLastTransactionHash(result.transaction_hash);
      setTransactionStatus("success");
    } catch (e) {
      console.error(e);
      setError((e as any).message);
      setTransactionStatus("idle");
    }
  };

  return (
    <form className="flex flex-col p-4 gap-3" onSubmit={submitSessionTransaction}>
      <h2 className="text-orange">Use session keys</h2>
      <input
        className="p-2 rounded-lg max-w-96"
        type="text"
        id="transfer-amount"
        name="fname"
        placeholder="Amount"
        value={amount}
        disabled={!accountSessionSignature}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        className={`${buttonsDisabled ? "opacity-30 text-orange" : "bg-blue-300"} p-2 rounded-lg max-w-96`}
        type="submit"
        disabled={buttonsDisabled}
      >
        Increase balance with session
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export { SessionKeysExecute };
