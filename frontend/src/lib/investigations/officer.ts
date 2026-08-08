// The signed-in officer. There is no authentication in this phase — this is a
// fixed synthetic identity used to attribute cases and notes, matching the
// officer shown in the top navigation.

export const currentOfficer = {
  name: "R. Sharma",
  role: "Investigating Officer",
  initials: "RS",
} as const;
