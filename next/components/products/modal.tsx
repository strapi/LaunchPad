"use client";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../ui/animated-modal";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { formatNumber } from "@/lib/utils";
import { IconTrash } from "@tabler/icons-react";

export default function AddToCartModal({ onClick }: { onClick: () => void }) {
  const images = [
    "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=3425&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const { items, updateQuantity, getCartTotal, removeFromCart } = useCart();
  return (
    <Modal>
      <ModalTrigger onClick={onClick} className="mt-10 w-full">
        Add to card
      </ModalTrigger>
      <ModalBody>
        <ModalContent>
          <h4 className="text-lg md:text-2xl text-neutral-600 font-bold text-center mb-8">
            Your cart
          </h4>

          {!items.length && (
            <p className="text-center text-neutral-700">
              Your cart is empty. Please purchase something.
            </p>
          )}
          <div className="flex flex-col  divide-y divide-neutral-100">
            {items.map((item, index) => (
              <div
                key={"purchased-item" + index}
                className="flex gap-2 justify-between items-center py-4"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    width={60}
                    height={60}
                    className="rounded-lg hidden md:block"
                  />
                  <span className="text-black text-sm md:text-base font-medium">
                    {" "}
                    {item.product.title}
                  </span>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0) {
                        updateQuantity(item.product, value);
                      }
                    }}
                    min="1"
                    step="1"
                    className="w-16 p-2 h-full rounded-md focus:outline-none bg-neutral-50 border border-neutral-100 focus:bg-neutral-100 text-black mr-4"
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    }}
                  />
                  <div className="text-black text-sm font-medium w-20">
                    ${formatNumber(item.product.price)}
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)}>
                    <IconTrash className="w-4 h-4 text-neutral-900" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ModalContent>
        <ModalFooter className="gap-4 items-center">
          <div className="text-neutral-700 ">
            total amount{" "}
            <span className="font-bold">${formatNumber(getCartTotal())}</span>
          </div>
          <button
            disabled={!items.length}
            className="bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm px-2 py-1 rounded-md border border-black w-28"
          >
            Buy now
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}
