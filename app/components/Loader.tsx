import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <StyledWrapper>
      <div className="custom-loader" />
    </StyledWrapper>
    </div>
  );
}

const StyledWrapper = styled.div`
  .custom-loader {
    width: 120px;
    height: 22px;
    border-radius: 20px;
    color: #25C1EC;
    border: 2px solid;
    position: relative;
  }

  .custom-loader::before {
    content: "";
    position: absolute;
    margin: 2px;
    inset: 0 100% 0 0;
    border-radius: inherit;
    background: #25C1EC;
    animation: p6 2s infinite;
  }

  @keyframes p6 {
    100% {
      inset: 0
    }
  }`;

export default Loader;
