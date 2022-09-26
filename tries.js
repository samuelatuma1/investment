// console.log(Array.from(new Set([11, 2, 0, 4])))
console.log((new Set([1, 5])).size)

const ts /*: Array<Object<string, number> */= [
    {amt: 4100}, {amt: -2130}, {amt: 7100}
]
console.log(ts[0].amt)
const balance /*: number */ = ts.reduce((prevT /*: number */, currT) => prevT + currT["amt"], 0);

console.log(balance);