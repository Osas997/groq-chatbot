import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptInsightsProvider {
  prompt(): string {
    return `Buatkan key insight dan key strategy berdasarkan data di atas.
  
      **Pola Penting:**
      1. Hubungan antara sentimen positif dan engagement: Apakah benar konten positif menghasilkan engagement 40% lebih tinggi?
      2. Analisis sentimen netral: Peluang apa yang bisa ditangkap UMKM untuk meningkatkan daya saing dari opini yang belum jelas positif/negative?
      3. Dari sentimen positif, aspek apa yang paling sering dipuji (harga, kualitas, pelayanan, inovasi)? Bagaimana UMKM bisa memanfaatkan hal tersebut sebagai branding?
      4. Berdasarkan analisis sentimen, strategi komunikasi digital apa yang sebaiknya dijalankan UMKM untuk meningkatkan citra di media sosial?
      5. Mengapa hanya 0.6% konten yang berhasil memicu emosi positif?
      6. Potensi Tersembunyi: Apakah ada postingan netral dengan engagement tinggi yang sebenarnya bisa dikategorikan positif?
      7. Analisis bagaimana UMKM lokal di Indonesia saat ini memanfaatkan media sosial untuk membangun citra brand. Identifikasi gap antara penggunaan media sosial tradisional dengan pendekatan analisis sentimen yang lebih canggih.
      8. Berikan data statistik terkini dan contoh kasus nyata
      9. Berikan rekomendasi aksi konkret yang bisa dijalankan UMKM pemula untuk mencapai target engagement dengan sentimen terpositif dari daftar brand yang diberikan.

      **Arah Analisis:**
      - Fokus pada: Strategi konten
      - Tujuan: Meningkatkan engagement melalui konten yang lebih emosional
      - Stakeholder: Tim marketing

      **Format Output:**
      1. **Headline Insight**: 1 kalimat singkat yang paling mencolok
      2. **Data Pendukung**: 3-5 angka kunci terkait
      3. **Analisis Mendalam**:
          - Penyebab potensial
          - Implikasi bisnis
          - Perbandingan dengan benchmark
      4. **Rekomendasi Aksi**:
          - 2-3 langkah konkret
          - Timeline implementasi
          - Metrik sukses
      5. **Risiko & Peluang**:
          - Risiko jika tidak diatasi
          - Peluang yang bisa dimanfaatkan
      6. **Saran dan Strategy**:
          - Saran untuk UMKM kedepannya
          - Strategy yang nanti digunakan kedepannya
      7. **Rekomendasi Aksi**: 2-3 langkah konkret yang bisa dijalankan UMKM pemula
      8. **Kesimpulan**: 1 kalimat singkat yang paling mencolok

      **Tingkat Kedalaman:** Komprehensif

      Berikan jawaban yang terstruktur dan mendalam berdasarkan data yang tersedia. tambahkan emoji yang relevan pada setiap Headline Insight`;
  }
}
