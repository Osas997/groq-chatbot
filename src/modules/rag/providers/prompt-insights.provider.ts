import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptInsightsProvider {
  prompt(): string {
    return `Buatkan key insight dan key strategy berdasarkan data di atas.
  
      <div class="insights-container">
      <strong>Pola Penting:</strong>
      <ol>
        <li>Hubungan antara sentimen positif dan engagement: Apakah benar konten positif menghasilkan engagement 40% lebih tinggi?</li>
        <li>Analisis sentimen netral: Peluang apa yang bisa ditangkap UMKM untuk meningkatkan daya saing dari opini yang belum jelas positif/negative?</li>
        <li>Dari sentimen positif, aspek apa yang paling sering dipuji (harga, kualitas, pelayanan, inovasi)? Bagaimana UMKM bisa memanfaatkan hal tersebut sebagai branding?</li>
        <li>Berdasarkan analisis sentimen, strategi komunikasi digital apa yang sebaiknya dijalankan UMKM untuk meningkatkan citra di media sosial?</li>
        <li>Mengapa hanya 0.6% konten yang berhasil memicu emosi positif?</li>
        <li>Potensi Tersembunyi: Apakah ada postingan netral dengan engagement tinggi yang sebenarnya bisa dikategorikan positif?</li>
        <li>Analisis bagaimana UMKM lokal di Indonesia saat ini memanfaatkan media sosial untuk membangun citra brand. Identifikasi gap antara penggunaan media sosial tradisional dengan pendekatan analisis sentimen yang lebih canggih.</li>
        <li>Berikan data statistik terkini dan contoh kasus nyata</li>
        <li>Berikan rekomendasi aksi konkret yang bisa dijalankan UMKM pemula untuk mencapai target engagement dengan sentimen terpositif dari daftar brand yang diberikan.</li>
      </ol>

      <strong>Arah Analisis:</strong>
      <ul>
        <li>Fokus pada: Strategi konten</li>
        <li>Tujuan: Meningkatkan engagement melalui konten yang lebih emosional</li>
        <li>Stakeholder: Tim marketing</li>
      </ul>

      <strong>Format Output (Gunakan HTML):</strong>
      <ol>
        <li><strong>Headline Insight</strong>: 1 kalimat singkat yang paling mencolok</li>
        <li><strong>Data Pendukung</strong>: 3-5 angka kunci terkait (Sajikan dalam &lt;table&gt; jika memungkinkan)</li>
        <li><strong>Analisis Mendalam</strong>:
            <ul>
                <li>Penyebab potensial</li>
                <li>Implikasi bisnis</li>
                <li>Perbandingan dengan benchmark</li>
            </ul>
        </li>
        <li><strong>Rekomendasi Aksi</strong>:
            <ul>
                <li>2-3 langkah konkret</li>
                <li>Timeline implementasi</li>
                <li>Metrik sukses</li>
            </ul>
        </li>
        <li><strong>Risiko & Peluang</strong>:
            <ul>
                <li>Risiko jika tidak diatasi</li>
                <li>Peluang yang bisa dimanfaatkan</li>
            </ul>
        </li>
        <li><strong>Saran dan Strategy</strong>:
            <ul>
                <li>Saran untuk UMKM kedepannya</li>
                <li>Strategy yang nanti digunakan kedepannya</li>
            </ul>
        </li>
        <li><strong>Rekomendasi Aksi</strong>: 2-3 langkah konkret yang bisa dijalankan UMKM pemula</li>
        <li><strong>Kesimpulan</strong>: 1 kalimat singkat yang paling mencolok</li>
      </ol>

      <strong>Tingkat Kedalaman:</strong> Komprehensif

      Berikan jawaban yang terstruktur dan mendalam berdasarkan data yang tersedia. Gunakan emoji yang relevan pada setiap Headline Insight. Pastikan output adalah valid HTML tanpa markdown wrappers.</div>
      
      Format: Jangan gunakan karakter dari markdown seperti "\\n" atau "\\t".
      `;
  }
}
