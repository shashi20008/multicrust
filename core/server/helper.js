import { networkInterfaces } from 'os';

export default function getAllCIDRs() {
  const allInterfaces = networkInterfaces();
  return Object.values(allInterfaces)
    .reduce(([all, interface]) => ([...all, ...interface]), [])
    .map;
}