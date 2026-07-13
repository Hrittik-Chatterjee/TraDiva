"use client";

import { useState, useTransition } from "react";
import { shipOrderAction, deliverOrderAction, cancelOrderAction } from "@/app/actions/order";

interface OrderFulfillmentManagerProps {
  orderId: string;
  currentStatus: string;
  shippingAddress: any;
}

export default function OrderFulfillmentManager({
  orderId,
  currentStatus,
  shippingAddress,
}: OrderFulfillmentManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Extract tracking details if already shipped
  const tracking = shippingAddress?.tracking || null;

  const handleShip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carrier || !trackingNumber) {
      setError("Please fill out both carrier and tracking number.");
      return;
    }

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await shipOrderAction(orderId, carrier, trackingNumber);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess("Order status updated to Shipped!");
      }
    });
  };

  const handleDeliver = async () => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await deliverOrderAction(orderId);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess("Order status updated to Delivered!");
      }
    });
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order? This will automatically restore item quantities to the product inventory and cannot be undone.")) {
      return;
    }

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await cancelOrderAction(orderId);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess("Order successfully cancelled and inventory restocked.");
      }
    });
  };

  return (
    <div className="p-6 border border-light-pink/60 bg-white rounded-2xl shadow-sm flex flex-col gap-6">
      <div>
        <h3 className="text-md font-bold text-ink flex items-center gap-2">
          ⚙️ Fulfillment Management
        </h3>
        <p className="text-xs text-stone mt-0.5">Update shipping details and order state.</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-3.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="p-3.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl">
          ✨ {success}
        </div>
      )}

      {/* Status Specific UI */}
      {currentStatus === "pending" || currentStatus === "paid" ? (
        <div className="flex flex-col gap-5">
          <form onSubmit={handleShip} className="flex flex-col gap-3.5">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">🚚 Ship Order</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-stone uppercase">Carrier</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  disabled={isPending}
                  className="px-3.5 py-2 text-sm border border-light-pink/60 focus:border-dark-pink focus:ring-1 focus:ring-dark-pink rounded-xl bg-white text-ink outline-none transition-all"
                >
                  <option value="">Select Carrier</option>
                  <option value="Steadfast Courier">Steadfast Courier</option>
                  <option value="Pathao Courier">Pathao Courier</option>
                  <option value="eCourier">eCourier</option>
                  <option value="RedX">RedX</option>
                  <option value="Paperfly">Paperfly</option>
                  <option value="Hand Delivery">Hand Delivery</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-stone uppercase">Tracking Number</label>
                <input
                  type="text"
                  placeholder="e.g. SF-9831723"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  disabled={isPending}
                  className="px-3.5 py-2 text-sm border border-light-pink/60 focus:border-dark-pink focus:ring-1 focus:ring-dark-pink rounded-xl bg-white text-ink outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-dark-pink hover:bg-dark-pink/90 disabled:bg-dark-pink/60 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {isPending ? "Processing..." : "Mark as Shipped"}
            </button>
          </form>

          <div className="border-t border-light-pink/30 pt-4 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">⚠️ Danger Zone</h4>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 rounded-xl transition-all cursor-pointer"
            >
              Cancel Order & Restock Inventory
            </button>
          </div>
        </div>
      ) : null}

      {currentStatus === "shipped" ? (
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-lightest-pink/20 border border-light-pink/40 rounded-xl flex flex-col gap-2">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">📦 Shipment Information</h4>
            <div className="grid grid-cols-2 gap-4 text-xs mt-1">
              <div>
                <span className="text-stone block uppercase font-bold text-[9px]">Carrier</span>
                <span className="font-semibold text-ink">{tracking?.carrier || "N/A"}</span>
              </div>
              <div>
                <span className="text-stone block uppercase font-bold text-[9px]">Tracking ID</span>
                <span className="font-mono font-bold text-ink">{tracking?.trackingNumber || "N/A"}</span>
              </div>
            </div>
            {tracking?.shippedAt && (
              <span className="text-[10px] text-stone mt-1 block">
                Shipped on: {new Date(tracking.shippedAt).toLocaleString()}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleDeliver}
            disabled={isPending}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/60 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            {isPending ? "Processing..." : "Mark as Delivered & Completed"}
          </button>

          <div className="border-t border-light-pink/30 pt-4 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">⚠️ Danger Zone</h4>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 rounded-xl transition-all cursor-pointer"
            >
              Cancel Order & Restock Inventory
            </button>
          </div>
        </div>
      ) : null}

      {currentStatus === "delivered" && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Completed</h4>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              This order has been fully delivered. Stock was successfully reduced and payment completed.
            </p>
          </div>
        </div>
      )}

      {currentStatus === "cancelled" && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3">
          <span className="text-2xl">🚫</span>
          <div>
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">Cancelled</h4>
            <p className="text-[11px] text-rose-700 mt-0.5">
              This order has been cancelled. Inventory restocked successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
