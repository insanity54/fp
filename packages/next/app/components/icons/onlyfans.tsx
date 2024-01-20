import * as React from "react"
const SvgComponent = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 256 256"
    {...props}
  >
    <g
      style={{
        stroke: "none",
        strokeWidth: 0,
        strokeDasharray: "none",
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        strokeMiterlimit: 10,
        fill: "none",
        fillRule: "nonzero",
        opacity: 1,
      }}
    >
      <path
        d="M30 15C13.431 15 0 28.431 0 45s13.431 30 30 30 30-13.431 30-30-13.431-30-30-30zm0 39c-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9a8.988 8.988 0 0 1-8.976 9H30z"
        style={{
          stroke: "none",
          strokeWidth: 1,
          strokeDasharray: "none",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          strokeMiterlimit: 10,
          fill: "#00aeef",
          fillRule: "nonzero",
          opacity: 1,
        }}
        transform="matrix(2.81 0 0 2.81 1.407 1.407)"
      />
      <path
        d="M63.72 37.5c7.622 2.194 16.62 0 16.62 0-2.611 11.4-10.891 18.54-22.831 19.409A29.935 29.935 0 0 1 30 75l9-28.606C48.252 16.992 52.994 15 74.935 15H90c-2.52 11.1-11.206 19.579-26.28 22.5z"
        style={{
          stroke: "none",
          strokeWidth: 1,
          strokeDasharray: "none",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          strokeMiterlimit: 10,
          fill: "#008ccf",
          fillRule: "nonzero",
          opacity: 1,
        }}
        transform="matrix(2.81 0 0 2.81 1.407 1.407)"
      />
    </g>
  </svg>
)
export default SvgComponent
