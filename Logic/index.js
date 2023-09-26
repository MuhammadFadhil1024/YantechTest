a = [15, 8, 8, 2, 6, 4, 1, 7];
m = 2;
k = 8;

console.log(solution(a, m, k));

function solution(a, m, k) {
  let count = 0;

  for (let i = 0; i < a.length - m + 1; i++) {
    const subarray = a.slice(i, i + m); // Ekstrak subarray dengan panjang `m` yang dimulai dari indeks `i`

    // cek apakah ada bilangan bulat yang sama dengan k dengan menggunakan function matchSumArrayWithK
    if (matchSumArrayWithK(subarray, k)) {
      count++;
    }
  }

  return count;
}

// Fungsi untuk melakukan pengecekan bilangan bulat yang dijumlah apakah ada yang sama dengan variable k
function matchSumArrayWithK(subarray, k) {
  for (let i = 0; i < subarray.length; i++) {
    for (let j = i + 1; j < subarray.length; j++) {
      if (subarray[i] + subarray[j] === k && i !== j) {
        return true;
      }
    }
  }
  return false;
}
