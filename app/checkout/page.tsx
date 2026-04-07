"use client";
import { SectionTitle, PriceRenderer, Label } from "@/components";
import { useProductStore } from "../_zustand/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import posthog from "posthog-js";
import { getIsLoggedInValue, withIsLoggedIn } from "@/lib/posthog-auth";

const CheckoutPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = getIsLoggedInValue(session);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    lastname: "",
    phone: "",
    email: "",
    company: "",
    adress: "",
    apartment: "",
    city: "",
    country: "",
    postalCode: "",
    orderNotice: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [useDifferentName, setUseDifferentName] = useState(false);
  const { products, total, clearCart } = useProductStore();
  const router = useRouter();

  const captureCheckoutEvent = (event: string, payload: Record<string, unknown>) => {
    posthog.capture(event, payload);

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event,
        ...payload,
      });
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.email) {
        try {
          const response = await apiClient.get(`/api/users/email/${session.user.email}`);
          if (response.ok) {
            const data = await response.json();
            setUserProfile(data);

            // Pre-fill basic details if available
            setCheckoutForm(prev => ({
              ...prev,
              name: data.firstName || prev.name,
              lastname: data.lastName || prev.lastname,
              email: data.email || session.user?.email || prev.email,
              company: data.company || prev.company,
              adress: data.addressLine || prev.adress,
              apartment: data.apartment || prev.apartment,
              city: data.city || prev.city,
              country: data.country || prev.country,
              postalCode: data.postalCode || prev.postalCode,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };
    fetchUserProfile();
  }, [session]);

  const handleChangeAddressToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsEditingAddress(checked);

    if (!checked && userProfile) {
      setCheckoutForm(prev => ({
        ...prev,
        company: userProfile.company || "",
        adress: userProfile.addressLine || "",
        apartment: userProfile.apartment || "",
        city: userProfile.city || "",
        country: userProfile.country || "",
        postalCode: userProfile.postalCode || "",
      }));
    } else if (checked) {
      setCheckoutForm(prev => ({
        ...prev,
        company: "",
        adress: "",
        apartment: "",
        city: "",
        country: "",
        postalCode: "",
      }));
    }
  };

  const handleDifferentNameToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setUseDifferentName(checked);

    if (checked) {
      setCheckoutForm(prev => ({
        ...prev,
        name: "",
        lastname: "",
        email: "",
      }));
    } else if (userProfile) {
      setCheckoutForm(prev => ({
        ...prev,
        name: userProfile.firstName || prev.name,
        lastname: userProfile.lastName || prev.lastname,
        email: userProfile.email || session?.user?.email || prev.email,
      }));
    }
  };

  // Compute total savings locally based on cart state
  const totalSavings = products.reduce((acc, item) => {
    if (item.hasDiscount && item.discountedPrice !== undefined) {
      return acc + (item.price - item.discountedPrice) * item.amount;
    }
    return acc;
  }, 0);

  // Add validation functions that match server requirements
  const validateForm = () => {
    const errors: string[] = [];

    // Name validation
    if (!checkoutForm.name.trim() || checkoutForm.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }

    // Lastname validation
    if (!checkoutForm.lastname.trim() || checkoutForm.lastname.trim().length < 2) {
      errors.push("Lastname must be at least 2 characters");
    }

    // Email validation
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!checkoutForm.email.trim() || !emailRegex.test(checkoutForm.email.trim())) {
      errors.push("Please enter a valid email address");
    }

    // Phone validation (must be at least 10 digits)
    const phoneDigits = checkoutForm.phone.replace(/[^0-9]/g, "");
    if (!checkoutForm.phone.trim() || phoneDigits.length < 10) {
      errors.push("Phone number must be at least 10 digits");
    }

    // Company validation (Optional)
    if (checkoutForm.company.trim() && checkoutForm.company.trim().length < 2) {
      errors.push("Company must be at least 2 characters if provided");
    }

    // Address validation
    if (!checkoutForm.adress.trim() || checkoutForm.adress.trim().length < 5) {
      errors.push("Address must be at least 5 characters");
    }

    // Apartment validation (Optional)
    if (checkoutForm.apartment.trim() && checkoutForm.apartment.trim().length < 1) {
      errors.push("Apartment must be at least 1 character if provided");
    }

    // City validation
    if (!checkoutForm.city.trim() || checkoutForm.city.trim().length < 5) {
      errors.push("City must be at least 5 characters");
    }

    // Country validation
    if (!checkoutForm.country.trim() || checkoutForm.country.trim().length < 5) {
      errors.push("Country must be at least 5 characters");
    }

    // Postal code validation
    if (!checkoutForm.postalCode.trim() || checkoutForm.postalCode.trim().length < 3) {
      errors.push("Postal code must be at least 3 characters");
    }

    return errors;
  };

  const makePurchase = async () => {
    // Client-side validation first
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        toast.error(error);
      });
      return;
    }

    // Basic client-side checks for required fields (UX only)
    const requiredFields = [
      "name",
      "lastname",
      "phone",
      "email",
      "adress",
      "city",
      "country",
      "postalCode",
    ];

    const missingFields = requiredFields.filter(
      (field) => !checkoutForm[field as keyof typeof checkoutForm]?.trim()
    );

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (products.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (total <= 0) {
      toast.error("Invalid order total");
      return;
    }

    setIsSubmitting(true);

    // Capture checkout initiated (non-PII)
try {
  const checkoutPayload = withIsLoggedIn({
    products_count: products.length,
    cart_value: total,
    currency: "USD",
    component: "CheckoutPage",
  }, isLoggedIn);

  captureCheckoutEvent("checkout_initiated", checkoutPayload);

} catch (err) {
  // don't block purchase if analytics fails
  console.warn("PostHog capture failed (checkout_initiated):", err);
}

    try {
      console.log("🚀 Starting order creation...");

      // Get user ID if logged in
      let userId: string | null = null;
      if (session?.user?.email) {
        try {
          console.log("🔍 Getting user ID for logged-in user:", session.user.email);
          const userResponse = await apiClient.get(`/api/users/email/${session.user.email}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            userId = userData.id;
            console.log("✅ Found user ID:", userId);
          } else {
            console.log("❌ Could not find user with email:", session.user.email);
          }
        } catch (userError) {
          console.log("⚠️  Error getting user ID:", userError);
        }
      }

      // Prepare the order data
      const orderData = {
        name: checkoutForm.name.trim(),
        lastname: checkoutForm.lastname.trim(),
        phone: checkoutForm.phone.trim(),
        email: checkoutForm.email.trim().toLowerCase(),
        company: checkoutForm.company.trim(),
        adress: checkoutForm.adress.trim(),
        apartment: checkoutForm.apartment.trim(),
        postalCode: checkoutForm.postalCode.trim(),
        status: "pending",
        total: total,
        city: checkoutForm.city.trim(),
        country: checkoutForm.country.trim(),
        orderNotice: checkoutForm.orderNotice.trim(),
        userId: userId, // Add user ID for notifications
      };

      console.log("📋 Order data being sent:", orderData);

      // Send order data to server for validation and processing
      const response = await apiClient.post("/api/orders", orderData);

      console.log("📡 API Response received:");
      console.log("  Status:", response.status);
      console.log("  Status Text:", response.statusText);
      console.log("  Response OK:", response.ok);

      // Check if response is ok before parsing
      if (!response.ok) {
        console.error("❌ Response not OK:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("Error response body:", errorText);

        // Try to parse as JSON to get detailed error info
        try {
          const errorData = JSON.parse(errorText);
          console.error("Parsed error data:", errorData);

          // Handle different error types
          if (response.status === 409) {
            // Duplicate order error
            toast.error(errorData.details || errorData.error || "Duplicate order detected");
            // capture failure
            try {
              const checkoutFailedPayload = withIsLoggedIn({
                reason: "duplicate_order",
                component: "CheckoutPage",
              }, isLoggedIn);

              captureCheckoutEvent("checkout_failed", checkoutFailedPayload);
            } catch (err) { }
            return; // Don't throw, just return to stop execution
          } else if (errorData.details && Array.isArray(errorData.details)) {
            // Validation errors
            errorData.details.forEach((detail: any) => {
              toast.error(`${detail.field}: ${detail.message}`);
            });
          } else if (typeof errorData.details === "string") {
            // Single error message in details
            toast.error(errorData.details);
          } else {
            // Fallback error message
            toast.error(errorData.error || "Order creation failed");
          }
        } catch (parseError) {
          console.error("Could not parse error as JSON:", parseError);
          toast.error("Order creation failed. Please try again.");
        }

        // capture generic failure
        try {
          const checkoutFailedPayload = withIsLoggedIn({
            reason: `http_${response.status}`,
            component: "CheckoutPage",
          }, isLoggedIn);

          captureCheckoutEvent("checkout_failed", checkoutFailedPayload);
        } catch (err) { }
        return; // Stop execution instead of throwing
      }

      const data = await response.json();
      console.log("✅ Parsed response data:", data);

      const orderId: string = data.id;
      console.log("🆔 Extracted order ID:", orderId);

      if (!orderId) {
        console.error("❌ Order ID is missing or falsy!");
        console.error("Full response data:", JSON.stringify(data, null, 2));
        throw new Error("Order ID not received from server");
      }

      console.log("✅ Order ID validation passed, proceeding with product addition...");

      // Add products to order
      for (let i = 0; i < products.length; i++) {
        console.log(`🛍️ Adding product ${i + 1}/${products.length}:`, {
          orderId,
          productId: products[i].id,
          quantity: products[i].amount,
        });

        await addOrderProduct(orderId, products[i].id, products[i].amount);
        console.log(`✅ Product ${i + 1} added successfully`);
      }

      console.log(" All products added successfully!");

      // once the order is fully created, clear the cart server-side so next visit starts fresh
      try {
        await fetch("/api/cart", { method: "DELETE" });
      } catch (err) {
        console.warn("Failed to clear server cart after checkout:", err);
      }

      // Capture purchase (non-PII — no address or personal fields)
try {
  const purchasePayload = withIsLoggedIn({
    order_id: orderId,
    total: total,
    currency: "USD",
    products: products.map((p: any) => ({
      product_id: p.id,
      quantity: p.amount,
      price: p.hasDiscount && p.discountedPrice !== undefined ? p.discountedPrice : p.price,
    })),
    user_id: userId || null,
    component: "CheckoutPage",
  }, isLoggedIn);

  captureCheckoutEvent("thank_you_page_final_step", purchasePayload);

} catch (err) {
  console.warn("PostHog capture failed (purchase):", err);
}

      const payloadData = {
        orderId,
        name: orderData.name,
        lastname: orderData.lastname,
        address: orderData.adress,
        city: orderData.city,
        country: orderData.country,
        apartment: orderData.apartment,
        postalCode: orderData.postalCode,
        total: total,
        items: products.map((p: any) => ({
          title: p.title,
          price: p.hasDiscount && p.discountedPrice !== undefined ? p.discountedPrice : p.price,
          amount: p.amount,
          image: p.image,
        })),
        timestamp: new Date().getTime()
      };

      const jsonString = JSON.stringify(payloadData);
      // Use browser-native btoa and encodeURIComponent to handle special characters correctly without relying on Node Buffer polyfills, which may fail for guest users.
      const encodedPayload = btoa(encodeURIComponent(jsonString));

      // Clear form and cart
      setCheckoutForm({
        name: "",
        lastname: "",
        phone: "",
        email: "",
        company: "",
        adress: "",
        apartment: "",
        city: "",
        country: "",
        postalCode: "",
        orderNotice: "",
      });
      clearCart();

      // Refresh notification count if user is logged in
      try {
        // This will trigger a refresh of notifications in the background
        window.dispatchEvent(new CustomEvent("orderCompleted"));
      } catch (error) {
        console.log("Note: Could not trigger notification refresh");
      }

      toast.success("Order created successfully! You will be contacted for payment.");
      setTimeout(() => {
        router.push(`/thank-you?data=${encodeURIComponent(encodedPayload)}`);
      }, 1000);
    } catch (error: any) {
      console.error("💥 Error in makePurchase:", error);

      // capture failure with generic message if available
      try {
        const checkoutFailedPayload = withIsLoggedIn({
          error: error?.message || String(error),
          component: "CheckoutPage",
        }, isLoggedIn);

        captureCheckoutEvent("checkout_failed", checkoutFailedPayload);
      } catch (err) { }

      // Handle server validation errors
      if (error.response?.status === 400) {
        console.log(" Handling 400 error...");
        try {
          const errorData = await error.response.json();
          console.log("Error data:", errorData);
          if (errorData.details && Array.isArray(errorData.details)) {
            // Show specific validation errors
            errorData.details.forEach((detail: any) => {
              toast.error(`${detail.field}: ${detail.message}`);
            });
          } else {
            toast.error(errorData.error || "Validation failed");
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          toast.error("Validation failed");
        }
      } else if (error.response?.status === 409) {
        toast.error("Duplicate order detected. Please wait before creating another order.");
      } else {
        console.log("🔍 Handling generic error...");
        toast.error("Failed to create order. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOrderProduct = async (orderId: string, productId: string, productQuantity: number) => {
    try {
      console.log("️ Adding product to order:", {
        customerOrderId: orderId,
        productId,
        quantity: productQuantity,
      });

      const response = await apiClient.post("/api/order-product", {
        customerOrderId: orderId,
        productId: productId,
        quantity: productQuantity,
      });

      console.log("📡 Product order response:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Product order failed:", response.status, errorText);
        throw new Error(`Product order failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Product order successful:", data);
    } catch (error) {
      console.error("💥 Error creating product order:", error);
      throw error;
    }
  };

  // Wait for Zustand persist to finish rehydrating from localStorage
  // before checking whether the cart is empty. Without this, on a page
  // refresh the store starts as [] (default) and the check fires too early.
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // Zustand persist exposes onFinishHydration to know when localStorage
    // data has been loaded into the store.
    const unsub = useProductStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // If hydration already finished before this effect ran (fast refresh, etc)
    if (useProductStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }

    return unsub;
  }, []);

  useEffect(() => {
    // Don't run until the store has been rehydrated from localStorage
    if (!hasHydrated) return;

    // Track checkout page view (non-PII)
try {
  const checkoutViewedPayload = withIsLoggedIn({
    products_count: products.length,
    cart_value: total,
    component: "CheckoutPage",
  }, isLoggedIn);

  captureCheckoutEvent("checkout_viewed", checkoutViewedPayload);

} catch (err) {
  console.warn("PostHog capture failed (checkout_viewed):", err);
}

    if (products.length === 0) {
      toast.error("You don't have items in your cart");
      router.push("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  return (
    <div className="bg-white">
      <SectionTitle
        title="Checkout"
        path={
          <>
            <Link href="/cart" className="hover:text-blue-200 transition-colors">Cart</Link>
            <span className="mx-2">|</span>
            <span className="opacity-75">Checkout</span>
          </>
        }
      />

      <div className="hidden h-full w-1/2 bg-white lg:block" aria-hidden="true" />
      <div className="hidden h-full w-1/2 bg-gray-50 lg:block" aria-hidden="true" />

      <main className="relative mx-auto grid max-w-screen-2xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
        <h1 className="sr-only">Order information</h1>

        {/* Order Summary */}
        <section
          aria-labelledby="summary-heading"
          className="bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              Order summary
            </h2>

            <ul role="list" className="divide-y divide-gray-200 text-sm font-medium text-gray-900">
              {products.map((product) => (
                <li key={product?.id} className="flex items-start space-x-4 py-6">
                  <Image
                    src={
                      product?.image
                        ? product.image.startsWith("http://") ||
                          product.image.startsWith("https://")
                          ? product.image
                          : `/${product.image}`
                        : "/product_placeholder.jpg"
                    }
                    unoptimized={
                      product?.image?.startsWith("http://") ||
                      product?.image?.startsWith("https://")
                    }
                    alt={sanitize(product?.title) || "Product image"}
                    width={80}
                    height={80}
                    className="h-20 w-20 flex-none rounded-md object-cover object-center"
                  />
                  <div className="flex-auto space-y-1">
                    <h3>{product?.title}</h3>
                    {product?.hasDiscount && product?.offerName && (
                      <span className="text-blue-600 font-semibold text-xs block mt-0.5 italic">
                        {product.offerName}
                      </span>
                    )}
                    <p className="text-gray-500">x{product?.amount}</p>
                  </div>
                  <div className="flex-none pt-1">
                    <PriceRenderer
                      price={product.price}
                      discountedPrice={product.discountedPrice}
                      hasDiscount={product.hasDiscount}
                      discountType={product.discountType}
                      discountValue={product.discountValue}
                      fontSize="base"
                    />
                  </div>
                </li>
              ))}
            </ul>

            <dl className="hidden space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block">
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd>${total + totalSavings}</dd>
              </div>
              {totalSavings > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Offer Applied </dt>
                  <dd className="text-green-600 font-medium">-${totalSavings}</dd>
                </div>
              )}
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Shipping</dt>
                <dd>$5</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt className="text-base">Total</dt>
                <dd className="text-base">${total === 0 ? 0 : Math.round(total + 5)}</dd>
              </div>
            </dl>
          </div>
        </section>

        <form className="px-4 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0">
          <div className="mx-auto max-w-lg lg:max-w-none">
            {/* Contact Information */}
            <section aria-labelledby="contact-info-heading">
              <div className="flex items-center justify-between mb-2">
                <h2 id="contact-info-heading" className="text-lg font-medium text-gray-900">
                  Contact information
                </h2>
                {isLoggedIn && userProfile && (
                  <div className="flex items-center">
                    <input
                      id="use-different-name"
                      name="use-different-name"
                      type="checkbox"
                      checked={useDifferentName}
                      onChange={handleDifferentNameToggle}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="use-different-name" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                      Order for someone else
                    </label>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Label htmlFor="name-input" required>First Name</Label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.name}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        name: e.target.value,
                      })
                    }
                    type="text"
                    id="name-input"
                    name="name-input"
                    autoComplete="given-name"
                    required
                    aria-required="true"
                    disabled={isSubmitting || (isLoggedIn && !!userProfile && !useDifferentName)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="lastname-input" required>Last Name</Label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.lastname}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        lastname: e.target.value,
                      })
                    }
                    type="text"
                    id="lastname-input"
                    name="lastname-input"
                    autoComplete="family-name"
                    required
                    aria-required="true"
                    disabled={isSubmitting || (isLoggedIn && !!userProfile && !useDifferentName)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="phone-input" required>Phone number (min 10 digits)</Label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.phone}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        phone: e.target.value,
                      })
                    }
                    type="tel"
                    id="phone-input"
                    name="phone-input"
                    autoComplete="tel"
                    required
                    aria-required="true"
                    disabled={isSubmitting}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="email-address" required>Email address</Label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.email}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        email: e.target.value,
                      })
                    }
                    type="email"
                    id="email-address"
                    name="email-address"
                    autoComplete="email"
                    required
                    aria-required="true"
                    disabled={isSubmitting || (isLoggedIn && !!userProfile && !useDifferentName)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </section>

            {/* Payment Notice */}
            <section className="mt-10">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Payment Information</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Payment will be processed after order confirmation. You will be contacted for payment details.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section aria-labelledby="shipping-heading" className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 id="shipping-heading" className="text-lg font-medium text-gray-900">
                  Shipping Address
                </h2>

                {isLoggedIn && userProfile && (
                  <div className="flex items-center">
                    <input
                      id="change-shipping-address"
                      name="change-shipping-address"
                      type="checkbox"
                      checked={isEditingAddress}
                      onChange={handleChangeAddressToggle}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="change-shipping-address" className="ml-2 block text-sm text-gray-900 cursor-pointer font-medium">
                      Change Shipping Address
                    </label>
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <Label htmlFor="company">Company</Label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="company"
                      name="company"
                      disabled={isSubmitting || (isLoggedIn && !!userProfile && !isEditingAddress)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={checkoutForm.company}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          company: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="address" required>Address</Label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      autoComplete="street-address"
                      required
                      aria-required="true"
                      disabled={isSubmitting || (isLoggedIn && !!userProfile && !isEditingAddress)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={checkoutForm.adress}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          adress: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="apartment">Apartment, suite, etc.</Label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="apartment"
                      name="apartment"
                      disabled={isSubmitting || (isLoggedIn && !!userProfile && !isEditingAddress)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={checkoutForm.apartment}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          apartment: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="city" required>City</Label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      autoComplete="address-level2"
                      required
                      aria-required="true"
                      disabled={isSubmitting || (isLoggedIn && !!userProfile && !isEditingAddress)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={checkoutForm.city}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          city: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="region" required>Country</Label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="region"
                      name="region"
                      autoComplete="address-level1"
                      required
                      aria-required="true"
                      disabled={isSubmitting || (isLoggedIn && !!userProfile && !isEditingAddress)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={checkoutForm.country}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          country: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="postal-code" required>Postal code</Label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="postal-code"
                      name="postal-code"
                      autoComplete="postal-code"
                      required
                      aria-required="true"
                      disabled={isSubmitting || (isLoggedIn && !!userProfile && !isEditingAddress)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={checkoutForm.postalCode}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          postalCode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor="order-notice">Order notice</Label>
                  <div className="mt-1">
                    <textarea
                      className="textarea textarea-bordered textarea-lg w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                      id="order-notice"
                      name="order-notice"
                      autoComplete="order-notice"
                      disabled={isSubmitting}
                      value={checkoutForm.orderNotice}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          orderNotice: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-10 border-t border-gray-200 pt-6 ml-0">
              <button
                type="button"
                onClick={makePurchase}
                disabled={isSubmitting}
                className="w-full rounded-md border border-transparent bg-blue-500 px-20 py-2 text-lg font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CheckoutPage;
