import { getArtist, getAllArtistAlbums, getAlbumTracks } from '../../lib/spotify';

let found = false;
let allNames = [];

let PATH = [];

const DEPTH_CONST = 2;

const sleep = async () => {
	return new Promise((resolve) => setTimeout(resolve, 3000));
};

const findPath = async (artistId, artistName, featsTable) => {
	await sleep();

	try {
		const albums = await getAllArtistAlbums(artistId);

		if (albums.error) console.log(albums);

		for (const album of albums.items) {
			let tracks = await getAlbumTracks(album.id);

			if (tracks.error) console.log(tracks);

			for (const track of tracks.items) {
				for (const artist of track.artists) {
					let isOnTheSong = track.artists.find((artist) => artist.name == artistName);
					if (isOnTheSong) {
						if (artist.name != artistName) {
							if (!featsTable.find((feat) => feat.artistName == artist.name)) {
								if (!allNames.find((name) => name == artist.name)) {
									allNames.push(artist.name);
									featsTable.push({
										artistName: artist.name,
										artistId: artist.id,
										track: track.name,
										album: album.name,
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
		console.error(error);
	}
};

const findPathHelper = async (depth, secondArtistName, artistId, artistName, feats) => {
	if (found) return;
	if (depth > DEPTH_CONST) {
		return;
	}

	// Zwraca wszystkie featy artysty
	await findPath(artistId, artistName, feats);

	let featTemp = feats.find((feat) => feat.artistName == secondArtistName);
	if (featTemp) {
		found = true;
		PATH.push({ artistId: featTemp.artistId, artistName: featTemp.artistName, track: featTemp.track, album: featTemp.album });
		return;
	} else {
		for (const feat of feats) {
			await findPathHelper(depth + 1, secondArtistName, feat.artistId, feat.artistName, feat.feats);

			if (PATH[PATH.length - 1] && feat.feats.find((feat) => feat.artistId == PATH[PATH.length - 1].artistId)) {
				PATH.push({ artistId: feat.artistId, artistName: feat.artistName, track: feat.track, album: feat.album });
			}
		}
	}
};

export default async function handler(req, res) {
	found = false;
	allNames = [];
	PATH = [];

	const artistId = req.body.artistId;
	const secondArtistId = req.body.secondArtistId;

	const artist = await getArtist(artistId);
	const secondArtist = await getArtist(secondArtistId);

	if (artist.error) console.log(artist);
	if (secondArtist.error) console.log(secondArtist);

	const artistName = artist.name;
	const secondArtistName = secondArtist.name;

	const feats = {
		artistName: artistName,
		artistId: artistId,
		feats: [],
		//{name: "xyz", track: "xyz", album: "xyz", feats: [...]},
	};

	console.log(artistName, secondArtistName);

	await findPathHelper(0, secondArtistName, artistId, artistName, feats.feats);

	console.log('---------------------------END');

	PATH.push({ artistName: artistName, artistId: artistId });
	PATH = PATH.reverse();

	res.json(PATH);
}
