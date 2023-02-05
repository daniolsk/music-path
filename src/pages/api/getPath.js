import {
    getArtist,
    getAllArtistAlbums,
    getAlbumTracks,
} from "../../lib/spotify";

let found = false;
let allNames = [];

let PATH = [];
let reqs = 0;

const DEPTH_CONST = 2;

const sleep = async () => {
    return new Promise((resolve) => setTimeout(resolve, 4000));
};

const findPath = async (artistId, artistName, featsTable) => {
    await sleep();

    try {
        const albums = await getAllArtistAlbums(artistId);
        reqs++;

        for (const album of albums.items) {
            let tracks = await getAlbumTracks(album.id);
            reqs++;

            for (const track of tracks.items) {
                for (const artist of track.artists) {
                    let isOnTheSong = track.artists.find(
                        (artist) => artist.name == artistName
                    );
                    if (isOnTheSong) {
                        if (artist.name != artistName) {
                            if (
                                !featsTable.find(
                                    (feat) => feat.artistName == artist.name
                                )
                            ) {
                                if (
                                    !allNames.find(
                                        (name) => name == artist.name
                                    )
                                ) {
                                    allNames.push(artist.name);
                                    featsTable.push({
                                        artistName: artist.name,
                                        artistId: artist.id,
                                        track: track.name,
                                        album: album.name,
                                        image: album.images[1].url,
                                        feats: [],
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error("ERROR:" + error);
    }
};

const findPathHelper = async (
    depth,
    secondArtistName,
    artistId,
    artistName,
    feats
) => {
    if (found) return;
    if (depth > DEPTH_CONST) {
        return;
    }

    // Zwraca wszystkie featy artysty
    await findPath(artistId, artistName, feats);

    let featTemp = feats.find((feat) => feat.artistName == secondArtistName);
    if (featTemp) {
        found = true;
        PATH.push({
            artistId: featTemp.artistId,
            artistName: featTemp.artistName,
            track: featTemp.track,
            album: featTemp.album,
            image: featTemp.image,
        });
        return;
    } else {
        for (const feat of feats) {
            console.log(`Szukam dla ${feat.artistName}...`);
            await findPathHelper(
                depth + 1,
                secondArtistName,
                feat.artistId,
                feat.artistName,
                feat.feats
            );

            if (
                PATH[PATH.length - 1] &&
                feat.feats.find(
                    (feat) => feat.artistId == PATH[PATH.length - 1].artistId
                )
            ) {
                PATH.push({
                    artistId: feat.artistId,
                    artistName: feat.artistName,
                    track: feat.track,
                    album: feat.album,
                    image: feat.image,
                });
            }
        }
    }
};

export default async function handler(req, res) {
    found = false;
    allNames = [];
    PATH = [];
    reqs = 0;

    const artistId = req.body.artistId;
    const secondArtistId = req.body.secondArtistId;

    const artist = await getArtist(artistId);
    const secondArtist = await getArtist(secondArtistId);

    const artistName = artist.name;
    const secondArtistName = secondArtist.name;

    const feats = {
        artistName: artistName,
        artistId: artistId,
        feats: [],
        //{name: "xyz", track: "xyz", album: "xyz", feats: [...]},
    };

    let startDate = new Date();

    console.log(
        `Starting finding path between "${artistName}" and "${secondArtistName}"`
    );

    await findPathHelper(
        0,
        secondArtistName,
        artistId,
        artistName,
        feats.feats
    );

    let endDate = new Date();
    let seconds = (endDate.getTime() - startDate.getTime()) / 1000;

    if (PATH.length > 0) {
        console.log(
            `Path found in ${seconds} seconds and ${reqs} requests to Spotify API!`
        );

        PATH.push({
            artistName: artistName,
            artistId: artistId,
            image: artist.images[1].url,
        });
        PATH = PATH.reverse();
        PATH.push({
            artistName: secondArtistName,
            artistId: secondArtistId,
            image: secondArtist.images[1].url,
        });

        res.json(PATH);
    } else {
        console.log("ERROR");
        res.status(503);
    }
}
