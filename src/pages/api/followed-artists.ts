import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/db'
import { _Artist, Artist } from '../../mongoose/Artist'
import { _User, User } from '../../mongoose/User'
import { getSession } from 'next-auth/react'
import { FindOne } from '../../mongoose/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse<_Artist[]>) {
  const session = await getSession({ req })
  await dbConnect()

  const user: FindOne<_User> = await User.findOne({ userId: session?.userId })
  const artists: _Artist[] = await Artist.find({ artistId: { $in: user?.followedArtists } })

  res.send(artists)
}

// a.forEach(artist => {
//   const newArtist = new Artist(artist)
//   newArtist.save()
// })

const a = [
  {
    artistId: '03SZv6slUnLnHI3IfwG0gl',
    name: 'Grossstadtgeflüster',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebf207a5c190cc387f070ccee1',
  },
  {
    artistId: '053q0ukIDRgzwTr4vNSwab',
    name: 'Grimes',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb34771f759ca81a422f5f2b57',
  },
  {
    artistId: '07EFLOqGqf1uKPcvepbSIS',
    name: 'Dismantled',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b2739e6be89d85a3939f9c6b5deb',
  },
  {
    artistId: '07MiScs25YZlJ3OrsF3GIK',
    name: 'Mihka!',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb482aa767f46cb51ee5a45dc3',
  },
  {
    artistId: '07ZhipyrvoyNoJejeyM0PQ',
    name: 'Higher Brothers',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb1dad86d305d41b6054dbb815',
  },
  { artistId: '07qX4AG3wORrhd4fzigbL3', name: 'K9999' },
  {
    artistId: '08PIVUXwnTV32NlbhA8YHX',
    name: 'Hängergäng',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b2730b62782f0919a774d72d6918',
  },
  {
    artistId: '0Cd6nHYwecCNM1sVEXKlYr',
    name: 'Krewella',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebb00ca9584449f2727bc241fb',
  },
  {
    artistId: '0DLfONSFG8AA0cQvh1yCrz',
    name: 'Project Pitchfork',
    coverArt: 'https://i.scdn.co/image/e9348dbe0feba8e284a202159b5939869d2b2dc9',
  },
  {
    artistId: '0FQHLgDeg1QZGzkyRxAPRd',
    name: 'G5SH',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebb8d1862c38030359bb0aaa7b',
  },
  {
    artistId: '0GDGKpJFhVpcjIGF8N6Ewt',
    name: 'Gojira',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb96c4949ee078fbef5d5adb68',
  },
  {
    artistId: '0I7HgbIetYEIweWq7nD6En',
    name: 'Notaker',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebb2c5bbcfe595cd6a64dc0314',
  },
  {
    artistId: '0MLOZd8nYoXxHpOzDH0vXJ',
    name: 'MMOTHS',
    coverArt: 'https://i.scdn.co/image/b906053f9707cd88a64bb165f19244ed3bbd6b0a',
  },
  {
    artistId: '0NV5eY4Jzg4ldg2ikGnV4n',
    name: 'Virus Syndicate',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eba583d7ec9f4ff8a60b2d91b2',
  },
  {
    artistId: '0OTY72l7CC7ynKzp6N2o5b',
    name: 'Daniel Deluxe',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb76fd4ff2a633a15d300947fa',
  },
  {
    artistId: '0RqtSIYZmd4fiBKVFqyIqD',
    name: 'Thirty Seconds To Mars',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb9cd2312e93fba5ce64ce55e1',
  },
  {
    artistId: '0UF7XLthtbSF2Eur7559oV',
    name: 'Kavinsky',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb2dc7b3180bad1885c6ee1320',
  },
  {
    artistId: '0X380XXQSNBYuleKzav5UO',
    name: 'Nine Inch Nails',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb047095c90419cf2a97266f77',
  },
  {
    artistId: '0Y0QSi6lz1bPik5Ffjr8sd',
    name: 'Ekali',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb5944586f169166ac0a03735e',
  },
  {
    artistId: '0Z43xNK0ZhtPW2eKi1L1OP',
    name: 'El Tigr3',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebfbf1240b697a07cae3f7786b',
  },
  {
    artistId: '0Zcr7pH4DQLdG2oq5Tlj4x',
    name: '三個人',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b27310bd86a05f44bc79548edb95',
  },
  {
    artistId: '0a7PEqrMMgqFe6NCzSNNyq',
    name: 'The Gothsicles',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb57f6327dbb08d72b8622d6ce',
  },
  {
    artistId: '0cMQ1u5neB0RWhQiSCXjdH',
    name: 'Hanzel und Gretyl',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb66dc56d57078fddbe5a0e6d0',
  },
  {
    artistId: '0daugAjUgbJSqdlyYNwIbT',
    name: 'Vicetone',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebcfd3d6c627f6f43d2b55e187',
  },
  {
    artistId: '0ervG9shMGJvl2Uw2RFmNW',
    name: 'Ex Machina',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b273411e2c417dea28936110bf41',
  },
  {
    artistId: '0fyaEHmSmZs2YWMgbruITA',
    name: 'Masiwei',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebfe03d4a0474f6228aa231c56',
  },
  {
    artistId: '0g5MFQ15G9ksDiv8SPeB6e',
    name: 'Trash80',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebd04329278c05ba8002ab8c36',
  },
  {
    artistId: '0gXx2aQ2mfovDfqCw10MQC',
    name: 'G Jones',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebc2f7066632f9f3819d52d520',
  },
  {
    artistId: '0gvrCzDfdcHWrTOanKBlJL',
    name: 'Schwefelgelb',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebb108d245c6c78758d7c585b0',
  },
  {
    artistId: '0hprEC0nsWuQPSHag1O2Vi',
    name: 'Gareth Emery',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebab8b3e2e7218ed4714d64d2f',
  },
  {
    artistId: '0iQiDjndfxOvBFk5l3MHEg',
    name: 'Danger Mode',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb3ad8b837cc82961679765bf0',
  },
  {
    artistId: '0jNDKefhfSbLR9sFvcPLHo',
    name: 'San Holo',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebbea280428d4ffabf1d7b0095',
  },
  {
    artistId: '0lLY20XpZ9yDobkbHI7u1y',
    name: 'Pegboard Nerds',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb0fb1220e7e3ace47ebad023e',
  },
  {
    artistId: '0lP5aPV834goEtT6asKAek',
    name: 'Das Bo',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebbb57abbf47435c707292b745',
  },
  {
    artistId: '0ouPTYWjHfprRwZH76ivWi',
    name: 'Feather',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb39bc8e3a2da0929965df71b9',
  },
  {
    artistId: '0qPGd8tOMHlFZt8EA1uLFY',
    name: 'RIOT',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebd9b107c777dc274451043935',
  },
  {
    artistId: '0tQn2q1TIEenLgodtb8Nhx',
    name: 'Zeromancer',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b2734f1be31f51f29e7cff0ed824',
  },
  {
    artistId: '0vr95mHdD2YEVeNXmGgYja',
    name: 'Street Fever',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb7d5512c3add572d746b1ac98',
  },
  {
    artistId: '0w2QFhEnPG6tLIvkogHbUi',
    name: 'Buku',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb779d7da3dd7d01cd6db264e0',
  },
  {
    artistId: '0ycHhPwPvoaO4VGzmMnXGq',
    name: 'Zomboy',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb252ca3ce5e3a1c740773a478',
  },
  {
    artistId: '0zUDeBCtajKzgNJTeWQiNi',
    name: 'Rotersand',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b2733c7fde9e3f799f17335079fa',
  },
  {
    artistId: '11S00dFcvNvJahis8MTGMD',
    name: 'Tiger JK',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebe6d2d564b6d4345774f16c6d',
  },
  {
    artistId: '135UnVjvSQVYps8S7iYKPH',
    name: 'Echo Image',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebebe7df62a81920dc2ab607e6',
  },
  {
    artistId: '16yUpGkBRgc2eDMd3bB3Uw',
    name: 'MitiS',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb1c21fddaef8781b528ede50c',
  },
  {
    artistId: '18Eu7uJEMPWwwt1QUdCglQ',
    name: 'INZO',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eb780aaba7765cf031292368cd',
  },
  {
    artistId: '1BhfLtbUmju5XfwMQ9TJdQ',
    name: 'G.U.T.S',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b27378021c474c194882348e5785',
  },
  {
    artistId: '1DLKitfb8fshL0DtCecRpY',
    name: 'Shawn Wasabi',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebd4bd0b64b55b7a6958022c54',
  },
  {
    artistId: '1EqjMnUkwH4HCsyysONZ6F',
    name: 'Camping Im Keller',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b2730d001faa300c9fe01312376f',
  },
  {
    artistId: '1IwzmBTWI4CzUNsZM7Zqd8',
    name: 'Dj Cutman',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5eba70c08dbb1a9f09fe3fc2f3a',
  },
  {
    artistId: '1JPy5PsJtkhftfdr6saN2i',
    name: 'Bassnectar',
    coverArt: 'https://i.scdn.co/image/ab6761610000e5ebe1aac5a59f6fe28130b396d4',
  },
]
