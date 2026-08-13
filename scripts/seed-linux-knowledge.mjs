import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL não está disponível para o seed.");

const distributions = [
  ["arch-linux", "Arch Linux", "Arch", "pacman", "https://archlinux.org/", "https://wiki.archlinux.org/title/Gaming"],
  ["cachyos", "CachyOS", "Arch", "pacman", "https://cachyos.org/", "https://wiki.cachyos.org/"],
  ["fedora", "Fedora Linux", "Fedora", "dnf", "https://fedoraproject.org/", "https://docs.fedoraproject.org/en-US/gaming/"],
  ["nobara", "Nobara", "Fedora", "dnf", "https://nobaraproject.org/", "https://nobaraproject.org/docs/"],
  ["ubuntu", "Ubuntu", "Debian", "apt", "https://ubuntu.com/", "https://help.ubuntu.com/"],
  ["bazzite", "Bazzite", "Fedora Atomic", "rpm-ostree", "https://bazzite.gg/", "https://docs.bazzite.gg/"],
  ["pop-os", "Pop!_OS", "Ubuntu", "apt", "https://system76.com/pop/", "https://support.system76.com/"],
  ["linux-mint", "Linux Mint", "Ubuntu/Debian", "apt", "https://linuxmint.com/", "https://linuxmint-user-guide.readthedocs.io/"],
  ["debian", "Debian", "Debian", "apt", "https://www.debian.org/", "https://www.debian.org/doc/"],
  ["opensuse", "openSUSE", "openSUSE", "zypper", "https://www.opensuse.org/", "https://doc.opensuse.org/"],
  ["endeavouros", "EndeavourOS", "Arch", "pacman", "https://endeavouros.com/", "https://discovery.endeavouros.com/"],
  ["manjaro", "Manjaro", "Arch", "pacman", "https://manjaro.org/", "https://wiki.manjaro.org/"],
  ["kde-neon", "KDE neon", "Ubuntu", "apt", "https://neon.kde.org/", "https://userbase.kde.org/"],
  ["gentoo", "Gentoo", "Gentoo", "emerge", "https://www.gentoo.org/", "https://wiki.gentoo.org/"],
];

const connection = await mysql.createConnection(databaseUrl);
try {
  await connection.beginTransaction();
  const sourceName = "Linux Gaming Hub editorial references";
  await connection.execute(
    "INSERT INTO content_sources (name, baseUrl, licenseNote, isOfficial) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE baseUrl = VALUES(baseUrl)",
    [sourceName, "https://wiki.archlinux.org/title/Gaming", "Referências oficiais e comunitárias registradas por artigo; revisar antes de cada publicação de comando.", false],
  );
  const [[source]] = await connection.execute("SELECT id FROM content_sources WHERE name = ? LIMIT 1", [sourceName]);

  for (const [slug, name, family, packageManager, officialUrl, sourceUrl] of distributions) {
    await connection.execute(
      "INSERT INTO distributions (slug, name, family, packageManager, officialUrl, gamingScore, scoreProvenance, status, sourceId, sourceUrl) VALUES (?, ?, ?, ?, ?, NULL, 'unknown', 'published', ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), family = VALUES(family), packageManager = VALUES(packageManager), officialUrl = VALUES(officialUrl), status = 'published', sourceId = VALUES(sourceId), sourceUrl = VALUES(sourceUrl)",
      [slug, name, family, packageManager, officialUrl, source.id, sourceUrl],
    );
  }

  const [records] = await connection.query("SELECT id, slug, name, family, packageManager, sourceUrl FROM distributions WHERE slug IN (?)", [distributions.map(([slug]) => slug)]);
  for (const distribution of records) {
    const articleSlug = `${distribution.slug}-gaming-reference`;
    const body = `# ${distribution.name} para Linux gaming\n\nEsta página reúne referências para instalar e configurar ferramentas de jogo nesta distribuição. O gerenciador de pacotes identificado é **${distribution.packageManager}**.\n\nAntes de executar um comando, confirme a versão em uso e consulte a documentação vinculada. Esta página não atribui um score de gaming enquanto não houver uma metodologia e fonte publicadas.\n\n## Próximas verificações\n\nUse os guias de Steam, drivers e Vulkan filtrados por distribuição. Se não houver um guia compatível com sua versão, a plataforma deve mostrar que não há instrução revisada disponível.`;
    await connection.execute(
      "INSERT INTO wiki_articles (slug, title, excerpt, body, distributionId, category, versionLabel, status, provenance, sourceId, sourceUrl) VALUES (?, ?, ?, ?, ?, 'distribution', 'initial', 'published', 'verified', ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), excerpt = VALUES(excerpt), body = VALUES(body), status = 'published', sourceId = VALUES(sourceId), sourceUrl = VALUES(sourceUrl)",
      [articleSlug, `${distribution.name}: referência para gaming`, `Ponto de partida para ferramentas de gaming no ecossistema ${distribution.family}.`, body, distribution.id, source.id, distribution.sourceUrl],
    );
  }

  const flatpakSourceName = "Flathub — Steam";
  await connection.execute(
    "INSERT INTO content_sources (name, baseUrl, licenseNote, isOfficial) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE baseUrl = VALUES(baseUrl), licenseNote = VALUES(licenseNote)",
    [flatpakSourceName, "https://flathub.org/en/apps/com.valvesoftware.Steam", "Pacote comunitário do Steam, sem suporte oficial da Valve segundo a página do Flathub.", false],
  );
  const [[flatpakSource]] = await connection.execute("SELECT id FROM content_sources WHERE name = ? LIMIT 1", [flatpakSourceName]);
  await connection.execute(
    "INSERT INTO setup_guides (slug, title, description, difficulty, guideVersion, status, provenance, sourceId, sourceUrl) VALUES (?, ?, ?, 'beginner', '1.0', 'published', 'community', ?, ?) ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), status = 'published', sourceId = VALUES(sourceId), sourceUrl = VALUES(sourceUrl)",
    ["install-steam-flatpak", "Instalar Steam pelo Flatpak", "Guia cross-distro para instalar o aplicativo com o ID com.valvesoftware.Steam. O pacote no Flathub é comunitário e não possui suporte oficial da Valve.", flatpakSource.id, "https://flathub.org/en/apps/com.valvesoftware.Steam"],
  );
  const [[guide]] = await connection.execute("SELECT id FROM setup_guides WHERE slug = 'install-steam-flatpak' LIMIT 1");
  await connection.execute("DELETE FROM setup_guide_steps WHERE guideId = ?", [guide.id]);
  const guideSteps = [
    [1, "Confirmar Flatpak e o remoto Flathub", "O comando requer que Flatpak e o remoto flathub já estejam configurados no sistema. Consulte a documentação do Flatpak caso o remoto não exista.", null, "Não execute comandos de repositório sem confirmar a política da sua distribuição."],
    [2, "Instalar o aplicativo Steam", "O identificador listado pelo Flathub para o Steam é com.valvesoftware.Steam.", "flatpak install flathub com.valvesoftware.Steam", "O Flathub identifica esta entrega como pacote comunitário e sem suporte oficial da Valve."],
    [3, "Conceder acesso a uma biblioteca em outra unidade, se necessário", "Use apenas quando a biblioteca estiver em outro caminho e você souber qual diretório deseja compartilhar com o aplicativo.", "flatpak override --user --filesystem=/path/to/your/Steam/Library com.valvesoftware.Steam", "Substitua o caminho pelo diretório real. Esta permissão amplia o acesso do aplicativo a arquivos locais."],
  ];
  for (const [stepOrder, title, explanation, command, warning] of guideSteps) {
    await connection.execute(
      "INSERT INTO setup_guide_steps (guideId, stepOrder, title, explanation, command, warning) VALUES (?, ?, ?, ?, ?, ?)",
      [guide.id, stepOrder, title, explanation, command, warning],
    );
  }

  await connection.execute(
    "INSERT INTO linux_fixes (slug, title, category, symptoms, possibleCauses, confidence, provenance, sourceId, sourceUrl, status) VALUES (?, ?, 'steam', ?, ?, 'medium', 'community', ?, ?, 'published') ON DUPLICATE KEY UPDATE symptoms = VALUES(symptoms), possibleCauses = VALUES(possibleCauses), status = 'published', sourceId = VALUES(sourceId), sourceUrl = VALUES(sourceUrl)",
    ["steam-flatpak-library-permission", "Steam Flatpak não acessa uma biblioteca em outra unidade", "O seletor de biblioteca não consegue acessar a pasta desejada fora das permissões do sandbox.", "O aplicativo Flatpak pode não ter acesso ao diretório que contém a biblioteca Steam.", flatpakSource.id, "https://flathub.org/en/apps/com.valvesoftware.Steam"],
  );
  const [[fix]] = await connection.execute("SELECT id FROM linux_fixes WHERE slug = 'steam-flatpak-library-permission' LIMIT 1");
  await connection.execute("DELETE FROM linux_fix_solutions WHERE fixId = ?", [fix.id]);
  await connection.execute(
    "INSERT INTO linux_fix_solutions (fixId, stepOrder, title, explanation, command, warning) VALUES (?, 1, ?, ?, ?, ?)",
    [fix.id, "Conceder acesso apenas à pasta da biblioteca", "A página do Flathub orienta adicionar uma permissão de filesystem para a pasta da biblioteca que o usuário escolheu.", "flatpak override --user --filesystem=/path/to/your/Steam/Library com.valvesoftware.Steam", "Use o menor caminho necessário e confira a pasta antes de confirmar o comando."],
  );

  await connection.commit();
  console.log(JSON.stringify({ distributions: records.length, wikiArticles: records.length, guides: 1, linuxFixes: 1 }, null, 2));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
