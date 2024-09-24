import {
  useSendUserOperation,
  useSmartAccountClient,
  useUser,
} from "@account-kit/react";
import { useState } from "react";
import { z } from "zod";
import { isInsufficientFundsError } from "../web3/errors/is-insufficient-funds-error";
import { isRejectedError } from "../web3/errors/is-rejected-error";
import { TEST_CONTRACT_ADDRESS } from "../config/contract";
import { encodeFunctionData } from "viem";
import { testAbi } from "../config/abi";
import { useNavigate } from "../contexts/use-navigate";
import { Address } from "../types";

const mintSchema = z.object({
  referralCode: z.string().optional(),
  email: z.string().email(),
  amount: z.number().positive(),
});

type MintType = z.infer<typeof mintSchema>;

export function useSmartNodesMint({ amount }: MintType) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = useUser();
  const { navigate } = useNavigate();
  const { client } = useSmartAccountClient({ type: "LightAccount" });
  const { sendUserOperationAsync } = useSendUserOperation({ client });

  async function mint(event: Event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const params = new URL(window.location.href).searchParams;
    const testFlag = "testSuccessModalOption";
    if (params.get(testFlag)) {
      setTimeout(() => {
        navigate({ query: new URLSearchParams({ hash: "0x123456789abcdef" }) });
        setLoading(false);
      }, 3 * 1000); // 3s
      return;
    }

    try {
      // const mintFee = await calculateMintFee(amount);
      // const mintFeeWithPrecision = Number(mintFee) / 10 ** 18;
      amount;

      const { hash } = await sendUserOperationAsync({
        uo: {
          target: TEST_CONTRACT_ADDRESS,
          data: encodeFunctionData({
            abi: testAbi,
            functionName: "mintTo",
            args: [user?.address as Address],
          }),
          // value: parseEther(String(mintFeeWithPrecision)),
        },
      });

      // await storeUserData({
      //   email,
      //   referralCode: referralCode || "",
      //   mintTxnHash: hash,
      //   tokenIds: [],
      //   wallet: "",
      // });

      navigate({ query: new URLSearchParams({ hash }) });
    } catch (error) {
      console.log(error);
      if (isInsufficientFundsError(error)) {
        setError(
          "Oops! You do not have sufficient funds to complete your purchase."
        );
      } else if (isRejectedError(error)) {
        setError("Oops! Looks like you rejected the transaction signature.");
      } else {
        setError(
          "Oops! Looks like an error occurred while trying to complete your purchase."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return { mint, loading, error };
}
