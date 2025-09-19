import React, { useState } from "react";

const LoadingUI = (WrappedComponent) => {
  return function WithLoadingComponent(props) {
    const [loading, setLoading] = useState(false);

    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    return (
      <>
        {loading && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#D5D5D7]  z-50 transition-opacity duration-300 ease-in-out">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-4 border-[#DF3F32] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-black text-lg font-medium">Please wait ...</p>
            </div>
          </div>
        )}
        <WrappedComponent
          {...props}
          startLoading={startLoading}
          stopLoading={stopLoading}
        />
      </>
    );
  };
};

export default LoadingUI;
