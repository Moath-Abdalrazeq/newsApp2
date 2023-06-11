import * as React from "react";
 
import Menu from "./Menu";
  export default function AdminScreen() {
    const user = { isAdmin: true };
  return (
<Menu user={user} />
 
  );
}
