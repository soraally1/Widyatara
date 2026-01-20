"use client";

import React from "react";
import Link, { LinkProps } from "next/link";
import { useTransitionContext } from "../TransitionContext";

interface AnimatedLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedLink = ({
  href,
  children,
  className,
  ...props
}: AnimatedLinkProps) => {
  const { triggerTransition } = useTransitionContext();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    triggerTransition(href.toString());
  };

  return (
    <Link href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </Link>
  );
};

export default AnimatedLink;
