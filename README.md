<a name="readme-top"></a>

<div align="center">
  <a href="https://discord.gg/cloudup-bitmistir-658745502120017958">
    <img src="https://media.discordapp.net/attachments/1356821033402765443/1359025631697961070/8e70d198-9ddc-40aa-b0c6-ccb4573f14a4_6499d2f1c46b106eed1e25892568aa55.png?ex=67f5fac0&is=67f4a940&hm=1ad58a3f7730df5282cfb864bd9a9343cf685870313980930ee54f0188fc9846&=&format=webp&quality=lossless" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">CloudUP README</h3>

  <p align="center">
    CloudUP Discord Kayıt, Guard Botu
    <br />
  </p>
</div>

# CloudUP Hakkında

[CloudUP Discord](https://discord.gg/ckEz8Yw)

Kayıt içeriği tag rol alma, sunucu guard içerği ile.

### YAPILACAKLAR LİSTESİ:

- Kayıt Sistemi
- Koruma Sistemi
- Müzik Sistemi (Gold Premium)
- Twitch & Youtube Sistemi (Pro Premium)

### PREMİUM

- 1 Aylık Gold Premium 65₺
- 1 Aylık Pro Sistemi 105₺ (Tüm Komutların Birleşimi)

### GOLD PREMİUM ÖZELLİKLERİ

- Müzik Komutlarını Açarsınız.
- Kayıt Sisteminde Özelleştirmeleri Açarsınız.

### PRO PREMİUM ÖZELLİKLERİ

- Twitch & Youtube Sistemlerini Açarsınız.

#### EKLENEN MODÜLLER;

- `express`.
- `express-session`
- `passport`
- `password-discord`
- `password-oauth2`
- `cors`
- `@prisma/client`
- `prisma`
- `moment`

`src/utils/Clo_Handler Komut başlığı eklendi.`

### Komut kategorize şekli ve kaç komut adı formülü.

- `{Commands_Names, Category_size,Commands_size, Commands, Category_in_Command_Size}`

```js
const Commands_Names = interaction.client.cl_handler.getCategoryName("User");
console.log("Genel kategorisine ait komutlar:", Commands_Names);
const Commands = interaction.client.cl_handler.getCategory();
const Category_size = Commands.categoryCount;
const Category_in_Command_Size = Commands.commandsPerCategory;
const Commands_size = Commands.totalCommands;
console.log(`Toplam Kategori Sayısı: ${Category_size}`);
console.log(`Toplam Komut Sayısı: ${Commands_size}`);
for (const category in Category_in_Command_Size) {
  console.log(
    `Kategori: ${category}, Komut Sayısı: ${Category_in_Command_Size[category]}`
  );
}
```

<img src="https://cdn.discordapp.com/attachments/1356821033402765443/1359025257314521161/image.png?ex=67f5fa66&is=67f4a8e6&hm=798e88504cec1c209a1e0d6b552c7a1b7b4eeec411a579338af3a6abbe9cd84f&" alt="Logo" width="80" height="80">

<p align="right">(<a href="#readme-top">yukarı git</a>)</p>