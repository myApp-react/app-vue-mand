import axios from "./base";

export const getfloorList = () =>
    axios({
        url: `/api/floor/data`,
        method: "GET",
    });

export const getfloorMap = (buildingId, floorId) =>
    axios({
        url: `/api/floor/map?buildingId=${buildingId}&floorId=${floorId}`,
        method: "GET",
    });


