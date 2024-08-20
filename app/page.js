"use client";
import { useState } from "react";
import { ethers } from "ethers";

export default function SignMessage() {
  const [signerAddress, setSignerAddress] = useState("");
  const [signature, setSignature] = useState("");
  const [verified, setVerified] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Connect wallet and get the signer
  async function connectWallet() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setSignerAddress(address);
        setIsConnected(true);
        return signer;
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        alert("Failed to connect wallet. Please try again.");
      }
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  }

  // Sign a message
  async function signMessage() {
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const signer = await connectWallet();
      const message = "Hello, please sign this message to verify your identity!";
      const signature = await signer.signMessage(message);
      setSignature(signature);
      alert("Message signed successfully.");
    } catch (error) {
      console.error("Failed to sign message:", error);
      alert("Failed to sign message. Please try again.");
    }
  }

  // Verify the signature
  async function verifySignature() {
    if (!signature) {
      alert("Please sign the message first.");
      return;
    }

    try {
      const message = "Hello, please sign this message to verify your identity!";
      const messageHash = ethers.utils.hashMessage(message);
      const recoveredAddress = ethers.utils.recoverAddress(messageHash, signature);

      if (recoveredAddress.toLowerCase() === signerAddress.toLowerCase()) {
        setVerified(true);
        alert("Signature is valid!");
      } else {
        setVerified(false);
        alert("Signature is invalid.");
      }
    } catch (error) {
      console.error("Failed to verify signature:", error);
      alert("Failed to verify signature. Please try again.");
    }
  }

  return (
    <div>
      <h1>Sign and Verify a Message</h1>
      {!isConnected ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Wallet Connected: {signerAddress}</p>
          <button onClick={signMessage}>Sign Message</button>
          {signature && (
            <div>
              <p>Signature: {signature}</p>
              <button onClick={verifySignature}>Verify Signature</button>
              {verified && <p>Signature Verified!</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
