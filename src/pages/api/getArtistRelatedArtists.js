// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getArtistRelatedArtists } from '../../lib/spotify';

export default async function handler(req, res) {
	const artistId = req.body.artistId;

	const data = await getArtistRelatedArtists(artistId);

	res.json(data);
}
