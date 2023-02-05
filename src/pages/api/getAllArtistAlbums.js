// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getAllArtistAlbums } from '../../lib/spotify';

export default async function handler(req, res) {
	const artistId = req.body.artistId;

	const data = await getAllArtistAlbums(artistId);

	res.json(data);
}
