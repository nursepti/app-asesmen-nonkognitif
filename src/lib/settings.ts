export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/siswa(.*)": ["siswa"],
  "/guru(.*)": ["guru"],
  "/list/guru": ["admin", "guru"],
  "/list/siswa": ["admin", "guru"],
  "/list/asessmen": ["admin"],
  "/list/kelas": ["admin", "guru"],
  "/list/jadwal": ["admin", "guru"],
};