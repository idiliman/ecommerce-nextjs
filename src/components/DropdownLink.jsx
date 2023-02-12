import Link from 'next/link';
import React from 'react';

function DropdownLink(props) {
  let { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <span {...rest}>{children}</span>
    </Link>
  );
}

export default DropdownLink;
