export const STRAY_AI_OUT_OF_SCOPE_RESPONSE = "Desculpe, eu sou uma IA para ajudar no aplicativo Stray Linux. Se tiver outra dúvida sobre jogos no Linux, seu PC, GameHub, LinuxFix ou recursos do app, pode falar.";

const CODE_GENERATION_PATTERN = /\b(crie|criar|faça|faca|escreva|gere|programa|programar|c[oó]digo|script|fun[cç][aã]o|function|classe|class|html|css|javascript|typescript|python|java|c\+\+|unity|godot|unreal)\b/i;
const STRAY_AI_DOMAIN_PATTERN = /\b(stray\s*(linux|ai)|gamehub|linuxfix|scanner|meu\s*pc|dashboard|linux|distro|distribui[cç][aã]o|arch|debian|ubuntu|fedora|opensuse|zorin|biglinux|flatpak|pacman|apt|dnf|zypper|steam|epic|heroic|gog|amazon\s*games?|proton|wine|vulkan|mesa|nvidia|amd|intel|gamemode|mangohud|gamescope|wayland|x11|driver|kernel|jogos?|games?|benchmark|fps|stutter|travamento|crash|mods?|workshop|controles?|controllers?|gpu|cpu|ram|hardware|instala[rç][aã]o)\b/i;

/**
 * Bloqueia pedidos de programação e consultas sem relação com o Stray Linux
 * antes de qualquer recuperação de contexto ou chamada de modelo.
 */
export function isStrayAiDomainQuestion(question: string) {
  return !CODE_GENERATION_PATTERN.test(question) && STRAY_AI_DOMAIN_PATTERN.test(question);
}
