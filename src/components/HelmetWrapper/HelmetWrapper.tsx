import React from "react";
import { Helmet } from "react-helmet";
import { PropsChild } from "../../interfaces/PropsChild";

interface Props extends PropsChild {
  siteTitle: string;
}
export default function HelmetWrapper({ children, siteTitle }: Props): JSX.Element {
  return (
    <>
      <Helmet>
        <title>{siteTitle} | TopRestaurant</title>
        <meta name="description" content="Toptal Restaurant" />
      </Helmet>
      {children}
    </>
  );
}
