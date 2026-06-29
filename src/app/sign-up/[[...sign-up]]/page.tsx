import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(circle_at_50%_120%,_#C6FF0030,_transparent_40%)]" />

      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundSize: "60px 60px",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          maskImage: "radial-gradient(circle at center, black 10%, transparent 80%)",
        }}
      />

      {/* Clerk overrides */}
      <style>{`
        .cl-rootBox { width: 100%; }
        .cl-card {
          background: #111111 !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          border-radius: 20px !important;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.6) !important;
        }
        .cl-headerTitle { color: #ffffff !important; }
        .cl-headerSubtitle { color: #9ca3af !important; }
        .cl-socialButtonsBlockButton {
          background: #1a1a1a !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: #ffffff !important;
          border-radius: 10px !important;
        }
        .cl-socialButtonsBlockButton:hover {
          background: #222 !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
        .cl-socialButtonsBlockButtonText { color: #ffffff !important; }
        .cl-dividerLine { background: rgba(255,255,255,0.08) !important; }
        .cl-dividerText { color: #4b5563 !important; }
        .cl-formFieldLabel { color: #9ca3af !important; font-size: 0.8rem !important; }
        .cl-formFieldInput {
          background: #1a1a1a !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 10px !important;
          color: #ffffff !important;
          caret-color: #C6FF00 !important;
        }
        .cl-formFieldInput:focus {
          border-color: #C6FF00 !important;
          box-shadow: 0 0 0 2px rgba(198,255,0,0.12) !important;
          outline: none !important;
        }
        .cl-formButtonPrimary {
          background: #C6FF00 !important;
          color: #000000 !important;
          font-weight: 700 !important;
          border-radius: 10px !important;
          border: none !important;
        }
        .cl-formButtonPrimary:hover { background: #d4ff33 !important; }
        .cl-footerActionLink { color: #C6FF00 !important; }
        .cl-footerActionLink:hover { color: #d4ff33 !important; }
        .cl-footerActionText { color: #6b7280 !important; }
        .cl-identityPreviewText { color: #ffffff !important; }
        .cl-identityPreviewEditButton { color: #C6FF00 !important; }
        .cl-formFieldSuccessText { color: #C6FF00 !important; }
        .cl-formFieldErrorText { color: #f87171 !important; }
        .cl-alertText { color: #f87171 !important; }
        .cl-otpCodeFieldInput {
          background: #1a1a1a !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: #ffffff !important;
          border-radius: 10px !important;
        }
        .cl-otpCodeFieldInput:focus { border-color: #C6FF00 !important; }
        .cl-logoBox { display: none !important; }
        .cl-footer { background: transparent !important; }
        .cl-main { background: transparent !important; }
        .cl-header { background: transparent !important; }
        .cl-userPreviewSecondaryIdentifier { color: #9ca3af !important; }
        .cl-formFieldInfoText { color: #9ca3af !important; }
      `}</style>

      {/* Glow blob */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C6FF00]/10 blur-[140px]" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">

        {/* Logo + heading */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#C6FF00] blur-2xl opacity-50 rounded-full" />
            <img
              src="https://i.ibb.co/HDHsqdqL/1000100954.png"
              alt="Devlynix"
              className="relative z-10 w-14 h-14 object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Initialize your account.
            </h1>
            <p className="mt-1 font-mono text-sm text-gray-400">
              Join 15,000+ builders shipping daily.
            </p>
          </div>
        </div>

        <div className="w-full max-w-md">
            {/* Clerk SignUp */}
            <SignUp
              forceRedirectUrl="/onboarding"
              appearance={{
                variables: {
                  colorPrimary: "#C6FF00",
                  colorBackground: "#111111",
                  colorDanger: "#ef4444",
                  borderRadius: "0.625rem",
                  colorText: "white",
                  colorInputText: "white",
                },
              }}
            />
        </div>

        {/* Footer note */}
        <p className="flex items-center gap-2 font-mono text-xs text-gray-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] animate-pulse inline-block" />
          Secured for Engineers · Devlynix {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
