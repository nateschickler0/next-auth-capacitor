import appConfig from "../app.config";

export const loginWithGithub = async (callback: () => void) => {
  console.log(appConfig.apiHost);
  /**
   * Fetches the CSRF token, needed for all requests
   * Bear in mind we need to set credentials to include
   * https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
   */
  const { csrfToken }: { csrfToken: string } = await fetch(
    `${appConfig.apiHost}/api/auth/csrf`,
    {
      credentials: "include",
    }
  ).then((res) => {
    return res.json();
  });
  console.log(csrfToken);

  /**
   * Generate an oAuth URL for the Twitter provider
   */
  const { url }: { url: string } = await fetch(
    `${appConfig.apiHost}/api/auth/signin/github`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        csrfToken,
        json: "true",
        callbackUrl: `${appConfig.apiHost}/me`,
      }),
      redirect: "follow",
      credentials: "include",
    }
  ).then((res) => res.json());

  console.log(url);
  /**
   * We are awaiting the import of the In App Browser as simply importing or requring it throws an error
   */
  const { InAppBrowser } = await import(
    "@awesome-cordova-plugins/in-app-browser"
  );

  /**
   * We open the instance of InAppBrowser with the URL and options
   * https://cordova.apache.org/docs/en/11.x/reference/cordova-plugin-inappbrowser/
   */
  const ref = InAppBrowser.create(
    url,
    "_blank",
    "location=yes,hidenavigationbuttons=yes,hideurlbar=yes,toolbarcolor=#f1f5f9"
  );

  if (ref) {
    /**
     * Here we can check if we've been successfully redirected, if we have we close the browser
     */
    ref!.on("loadstart").subscribe((e: any) => {
      const includesUrl = e.url.includes(`/me`);
      if (includesUrl) {
        ref.close();
      }
    });

    /**
     * We can also trigger a callback when we exit the InAppBrowser
     */
    ref.on("exit").subscribe(async () => {
      callback();
    });
  }
};

export const loginWithCredentials = async (callback: () => void) => {
  /**
   * Fetches the CSRF token, needed for all requests
   * Bear in mind we need to set credentials to include
   * https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
   */
  const { csrfToken }: { csrfToken: string } = await fetch(
      `${appConfig.apiHost}/api/auth/csrf`,
      {
        credentials: "include",
      }
  ).then((res) => {
    return res.json();
  });

  /**
   * Generate an oAuth URL for the Twitter provider
   */
  const { url }: { url: string } = await fetch(
      `${appConfig.apiHost}/api/auth/signin/credentials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          csrfToken,
          json: "true",
          callbackUrl: `${appConfig.apiHost}/me`,
        }),
        redirect: "follow",
        credentials: "include",
      }
  ).then((res) => res.json());

  /**
   * We are awaiting the import of the In App Browser as simply importing or requring it throws an error
   */
  const { InAppBrowser } = await import(
      "@awesome-cordova-plugins/in-app-browser"
      );

  /**
   * We open the instance of InAppBrowser with the URL and options
   * https://cordova.apache.org/docs/en/11.x/reference/cordova-plugin-inappbrowser/
   */
      // const ref = InAppBrowser.create(
      //     url,
      //     "_blank",
      //     "location=yes,hidenavigationbuttons=yes,hideurlbar=yes,toolbarcolor=#f1f5f9"
      // );
  const ref = InAppBrowser.create(
          url,
          "_blank",
          "location=yes,toolbarcolor=#f1f5f9"
      );
  console.log("ref", !!ref);

  if (ref) {
    /**
     * Here we can check if we've been successfully redirected, if we have we close the browser
     */
    ref!.on("loadstart").subscribe((e: any) => {
      const includesUrl = e.url.includes(`/me`);
      if (includesUrl) {
        ref.close();
      }
    });

    /**
     * We can also trigger a callback when we exit the InAppBrowser
     */
    ref.on("exit").subscribe(async () => {
      callback();
    });
  }
};
