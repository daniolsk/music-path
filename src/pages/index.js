import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

import Loading from "../components/loading";
import ArrowDown from "../components/arrowDown";

export default function Home() {
    const router = useRouter();

    const [artistId, setArtistId] = useState("0MIG6gMcQTSvFbKvUwK0id");
    const [secondArtistId, setSecondArtistId] = useState(
        "77QIEno3j2L5WkrHkh2OnP"
    );
    const [loading, setLoading] = useState(false);
    const [feats, setFeats] = useState([]);

    const getArtistConnection = async () => {
        if (loading) return;

        setLoading(true);
        const res = await fetch("/api/getPath", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ artistId, secondArtistId }),
        });

        const data = await res.json();

        setLoading(false);
        setFeats(data);
        console.log(data);
    };

    return (
        <div className="flex h-screen w-screen flex-col p-16 align-middle">
            {feats.length > 0 ? (
                <div className="m-auto flex min-w-[450px] flex-col overflow-auto px-20">
                    {feats.map((feat, index) => {
                        switch (index) {
                            case 0:
                                return (
                                    <div className="mb-6 flex w-[450px] items-center justify-between">
                                        <Image
                                            alt="artist image"
                                            className="mr-32 h-44 w-44"
                                            src={feat.image}
                                            width={320}
                                            height={320}
                                        ></Image>
                                        <div className="text-right">
                                            <b>{feat.artistName}</b>
                                        </div>
                                    </div>
                                );
                            default:
                                return (
                                    <div className="mb-6 flex w-[450px] items-center justify-between">
                                        <Image
                                            alt="artist image"
                                            className="mr-32 h-44 w-44"
                                            src={feat.image}
                                            width={320}
                                            height={320}
                                        ></Image>
                                        {feats.length - 1 == index ? (
                                            <div className="text-right">
                                                <div>
                                                    <b>{feat.artistName}</b>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-right">
                                                <div>
                                                    <b>{feat.artistName}</b>
                                                </div>
                                                <div>Track: {feat.track}</div>
                                                <div>Album: {feat.album}</div>
                                            </div>
                                        )}
                                    </div>
                                );
                        }
                    })}
                    <button
                        onClick={() => router.refresh()}
                        className="mt-10 border-2 px-6 py-4 hover:bg-gray-600 disabled:hover:bg-transparent"
                    >
                        Back
                    </button>
                </div>
            ) : (
                <div>
                    <h1 className="text-center text-3xl font-bold">
                        Find path between artists
                    </h1>
                    <h3 className="mb-12 text-center text-sm italic">
                        by Daniel Skowron
                    </h3>
                    <div className="mb-6 flex flex-row justify-center">
                        <div className="mr-12">
                            <div className="mb-2 text-center">
                                First artist id:
                            </div>
                            <input
                                value={artistId}
                                onChange={(e) => setArtistId(e.target.value)}
                                className="mb-4 w-72 border-2 border-gray-200 p-2 disabled:border-gray-600 disabled:text-gray-500"
                                type="text"
                                name="artist-id"
                                id="artist-id"
                                disabled={loading ? true : false}
                            />
                        </div>
                        <div>
                            <div className="mb-2 text-center">
                                Second artist id:
                            </div>
                            <input
                                value={secondArtistId}
                                onChange={(e) =>
                                    setSecondArtistId(e.target.value)
                                }
                                className="mb-4 w-72 border-2 border-gray-200 p-2 disabled:border-gray-600 disabled:text-gray-500"
                                type="text"
                                name="second-artist-id"
                                id="second-artist-id"
                                disabled={loading ? true : false}
                            />
                        </div>
                    </div>
                    <div className="mb-10 text-center text-sm text-gray-400">
                        Examples:
                        <br />
                        <br />
                        <div className="text-gray-400">
                            Mata: 0MIG6gMcQTSvFbKvUwK0id
                        </div>
                        <div className="text-gray-400">
                            Zeamsone: 1FdfWn1DrRwWDtRK8faYKY
                        </div>
                        <div className="text-gray-400">
                            Sir Mich: 77QIEno3j2L5WkrHkh2OnP
                        </div>
                        <div className="text-gray-400">
                            Young Igi: 1yq2JzsqbzFbJ1B7wGOXLc
                        </div>
                        <div className="text-gray-400">
                            TEDE: 38iqZSGa2pvToKrMISU8g1
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            disabled={loading ? true : false}
                            onClick={getArtistConnection}
                            className="border-2 px-12 py-4 hover:bg-gray-600 disabled:hover:bg-transparent"
                        >
                            Find!
                        </button>
                    </div>
                    {loading ? (
                        <div className="mt-10 flex flex-col justify-center align-middle">
                            <div className="mb-6 flex justify-center">
                                <Loading />
                            </div>
                            <div className="text-center text-xs text-gray-200">
                                (this may take a while - do not close this
                                window)
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            )}
        </div>
    );
}
