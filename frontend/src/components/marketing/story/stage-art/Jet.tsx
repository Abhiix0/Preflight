type SVGProps = React.SVGProps<SVGSVGElement>;

export function Jet(props: SVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1 .5-3 0-4.5 1.5L13 8 4.8 6.2c-1.2-.3-2.1.1-2.5 1-.3.8.4 1.8 1.5 2.1L8 10.5l-3.5 3.5-2.5-.5-1.5 1.5 4 1 1 4 1.5-1.5-.5-2.5 3.5-3.5 1.2 4.2c.3 1.1 1.3 1.8 2.1 1.5.9-.4 1.3-1.3 1-2.5z" />
      <path d="M12 12l2 2" />
      <path d="M3 21l3-3" />
    </svg>
  );
}
