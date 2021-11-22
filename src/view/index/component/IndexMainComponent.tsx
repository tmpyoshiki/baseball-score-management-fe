import React from "react";
import { Reset } from "styled-reset";
import Navigation from "../../common/component/Navigation";
import IndexContents from "./IndexContents";
import Header from "../../common/component/Header";

const IndexMainComponent = (): JSX.Element => {
  return (
    <React.Fragment>
      <Reset />
      <Header />
      <Navigation />
      <IndexContents />
    </React.Fragment>
  );
};
export default IndexMainComponent;