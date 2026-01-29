import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Sparkles } from "lucide-react";
import { useNFT } from "../context/NFTContext";
import { uploadFileToIPFS, uploadMetadata } from "../pinata.js";
import { getNFTContract, getMarketplaceContract } from "../web3.js";
import { NFT_ADDRESS } from "../constants";

interface CreateModalProps {
  onClose: () => void;
}

export const CreateModal = ({ onClose }: CreateModalProps) => {
  const { createNFT } = useNFT(); // Assuming useNFT context is handling NFT state
  const [formData, setFormData] = useState({
    name: "",
    creator: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select an image");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Upload Image to IPFS
      await newFunction();

      alert("NFT created successfully!");
      onClose(); // Close the modal after successful minting
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("There was an error creating your NFT.");
    } finally {
      setLoading(false);
    }

    async function newFunction() {
      const imageURL = await uploadFileToIPFS(imageFile!);

      // Step 2: Upload metadata to IPFS
      const metadataURL = await uploadMetadata(
        formData.name,
        formData.description,
        imageURL,
      );

      // Step 3: Mint NFT
      const nftContract = await getNFTContract(true);
      const tx = await nftContract.mint(metadataURL);
      const receipt = await tx.wait();

      let tokenId: string | undefined;

      for (const log of receipt.logs) {
        try {
          const parsed = nftContract.interface.parseLog(log);

          // Type guard for null
          if (!parsed) continue;

          if (parsed.name === "Transfer") {
            tokenId = parsed.args.tokenId.toString();
            console.log("✅ Found tokenId:", tokenId);
            break;
          }
        } catch (err) {
          // ignore logs that don't match ABI
        }
      }

      if (!tokenId) {
        console.error("❌ FULL RECEIPT LOGS:", receipt.logs);
        throw new Error("Failed to get tokenId from mint transaction");
      }

      // Step 4: Store ONLY SMALL DATA
      createNFT(
        {
          name: formData.name,
          creator: formData.creator,
          description: formData.description,
          image: imageURL,
          isForSale: false,
          contractAddress: NFT_ADDRESS,
          isForAuction: false,
        },
        tokenId,
      );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-gradient-to-br from-gray-900 to-purple-900/50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors z-10"
          >
            <X className="w-6 h-6 text-gray-300" />
          </button>

          {/* Header */}
          <div className="p-8 pb-6 border-b border-purple-500/20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Create New NFT
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Upload your masterpiece to the blockchain
                </p>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Image Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Image *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="block cursor-pointer"
                  >
                    {imagePreview ? (
                      <div className="relative group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-2xl border-2 border-purple-500/30"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                          <Upload className="w-8 h-8 text-white" />
                          <span className="ml-2 text-white font-medium">
                            Change Image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-purple-500/30 rounded-2xl p-12 text-center hover:border-purple-500/50 transition-colors bg-purple-500/5">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                        <p className="text-gray-300 font-medium">
                          Click to upload image
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </motion.div>

              {/* NFT Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  NFT Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter NFT name"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </motion.div>

              {/* Creator Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Creator Name *
                </label>
                <input
                  type="text"
                  value={formData.creator}
                  onChange={(e) =>
                    setFormData({ ...formData, creator: e.target.value })
                  }
                  placeholder="Enter creator name"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your NFT"
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-bold text-white transition-all shadow-lg shadow-purple-500/50"
              >
                Create NFT
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
