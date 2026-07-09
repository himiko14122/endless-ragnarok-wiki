# RF Online Next Wiki — 更新日志

## v2.1.0 — 2026年6月18日

### 🔥 全球上线特别更新

RF Online Next已于2026年6月16日正式全球上线！本次更新聚焦于全球上线后的最新资讯、社区热点和SEO优化。

---

### 📦 新增内容

#### 1. 新增兑换码
- **DEVNOTE7** — 游戏内奖励物品（限时有效）
- **RFONLAUNCH** — 上线庆祝礼包，300石英，经验加成x5
- 更新兑换码页面标题和描述，增强SEO关键词覆盖：`rf online next codes`、`rf online next coupon`、`rf online next codes 2026`、`DEVNOTE7 code`

#### 2. 新增攻略：下载安装指南
- 新增4语言版本（英语/中文/日语/韩语）的**下载安装攻略**
- 覆盖所有4个平台的下载方式：
  - PC — Netmarble启动器
  - PC — Epic Games Store
  - iOS — App Store
  - Android — Google Play
- 包含**系统配置需求**（最低/推荐配置）
- 介绍**Netmarble Connect远程游玩**功能及设置步骤
- 明确标注**游戏未上架Steam**（社区常见痛点）
- 跨平台游玩说明

#### 3. 新增Scion种族信息
- 在游戏数据中新增**Scion（斯凯恩）**种族数据结构
- Scion是RF Online Next的新种族，40级时选择阵营归属
- 添加4语言翻译键

#### 4. 新增平台信息数据
- 新增4个平台的下载链接和类型数据（PC/Mobile）
- 系统需求完整数据（最低/推荐）
- Scion种族数据（ allegianceLevel: 40）

---

### 🔍 SEO优化

#### 兑换码页面（promo-codes）
- **标题优化**：`Promo Codes & Coupon Codes | RF Online Next Wiki`（增加"Coupon Codes"关键词）
- **描述优化**：增加"June 2026"、"how to redeem codes on iOS, Android, and PC"等搜索热词
- **关键词扩展**：从6个增至14个，新增：
  - `rf online next coupon codes`
  - `rf online next redeem codes`
  - `rf online next codes June 2026`
  - `coupon.netmarble.com rfnext`
  - `DEVNOTE7 code`
  - `how to redeem RF Online Next codes`
  - `RF Online Next codes iOS/Android/PC`
- **新增HowTo结构化数据**：添加Schema.org HowTo类型，帮助Google展示步骤化兑换指南

#### 首页FAQ扩展
- 新增6个高频FAQ条目（4语言翻译）：
  - ❓ **满级是多少？** → 覆盖 `rf online next max level` 关键词
  - ❓ **哪些平台可以玩？** → 覆盖平台下载搜索词
  - ❓ **如何兑换兑换码？** → 覆盖 `rf online next coupon` 关键词
  - ❓ **Scion是什么？** → 覆盖新种族相关搜索
  - ❓ **支持远程游玩吗？** → 覆盖Netmarble Connect搜索
  - ❓ **钻石优先花在哪？** → 覆盖社区高频痛点

---

### ✏️ 内容完善

#### 兑换码兑换方式更新
- **原版**：4步简单指引（点击头像→设置→兑换码→确认）
- **新版**：分为两种方法的详细指引：
  - **方法一：游戏内兑换**（Android和PC端）— 通过设置→账号/条款→兑换优惠券
  - **方法二：官方网站兑换**（iOS和全平台）— 访问coupon.netmarble.com/rfnext，输入会员编号和兑换码
  - 新增"会员编号查找方式"提示

#### 翻译键更新
- 新增 `nav.download` / `nav.systemReq` 导航键
- 新增 `race.scion` / `race.scion.desc` Scion种族键
- 新增 `stats.platforms` / `stats.languages` 统计数据键
- 新增 `guide.download` 攻略标题键
- 新增6个FAQ翻译键（en/zh/ja/ko全覆盖）

---

### 📋 社区调研发现

#### 数据来源
- **MassivelyOP**：全球上线报道（6月16日发布）
- **r/RFnext Reddit**：玩家评价、游戏机制分析
- **Gamesolusi**：最新兑换码和兑换教程
- **Netmarble官方论坛**：PC启动器和Netmarble Connect指南
- **YouTube（R0ixy Dragony）**：新手攻略、职业推荐视频
- **Instagram/Facebook**：预注册活动、上线宣传

#### 社区痛点（已针对性解决）
1. ❌ **不知道去哪下载** → ✅ 新增下载安装攻略
2. ❌ **找不到Steam** → ✅ 明确标注未上架Steam，提供替代方案
3. ❌ **iOS无法游戏内兑换** → ✅ 新增官方网站兑换方法
4. ❌ **不知道满级是多少** → ✅ 新增FAQ条目
5. ❌ **钻石不知道花在哪** → ✅ 新增社区推荐FAQ
6. ❌ **Scion种族不了解** → ✅ 新增Scion种族数据和FAQ

---

### 📁 修改文件清单

| 文件 | 修改类型 |
|------|----------|
| `src/data/game-data.ts` | 新增DEVNOTE7/RFONLAUNCH兑换码、Scion种族数据、系统需求数据、平台信息数据 |
| `src/i18n/dictionaries/en.ts` | 新增6个FAQ键、导航键、种族键、统计键 |
| `src/i18n/dictionaries/zh.ts` | 同上（中文翻译） |
| `src/i18n/dictionaries/ja.ts` | 同上（日语翻译） |
| `src/i18n/dictionaries/ko.ts` | 同上（韩语翻译） |
| `src/app/[locale]/page.tsx` | FAQ区扩展至14个条目 |
| `src/app/[locale]/promo-codes/page.tsx` | SEO标题/描述/关键词优化、双方法兑换教程、HowTo结构化数据 |
| `src/data/guides/en/download-install-guide.mdx` | 新增英语下载安装攻略 |
| `src/data/guides/zh/download-install-guide.mdx` | 新增中文下载安装攻略 |
| `src/data/guides/ja/download-install-guide.mdx` | 新增日语下载安装攻略 |
| `src/data/guides/ko/download-install-guide.mdx` | 新增韩语下载安装攻略 |

---

### 🎯 SEO关键词覆盖矩阵

| 目标关键词 | 覆盖位置 | 优化措施 |
|------------|----------|----------|
| `rf online next codes` | promo-codes页面 | 标题+H1+Meta+Schema |
| `rf online next coupon` | promo-codes页面 | Meta描述+关键词+H2 |
| `rf online next max level` | 首页FAQ | 新增FAQ条目+Schema FAQPage |
| `rf online next codes 2026` | promo-codes页面 | Meta关键词+描述更新 |
| `rf online next download` | 下载攻略页面 | 新增完整攻略+关键词 |
| `rf online next system requirements` | 下载攻略页面 | 系统需求表格+关键词 |
| `DEVNOTE7 code` | promo-codes页面 | 兑换码表格+关键词 |
| `coupon.netmarble.com rfnext` | promo-codes页面 | 兑换方法步骤+关键词 |
| `rf online next how to redeem` | promo-codes页面 | HowTo Schema+步骤说明 |

---

### 🔍 v2.2.0 长尾词优化补充（2026年6月18日）

#### 新增目标关键词覆盖

| 目标关键词 | 覆盖位置 | 优化措施 |
|------------|----------|----------|
| `rf online next class` | classes列表页 | 标题含"Class Guide"、新增17个关键词、hreflang多语言 |
| `rf online classes` | classes列表页+详情页 | 列表页17个关键词、详情页7个关键词/class |
| `rf online next steam` | 首页FAQ+下载区+Schema | 新增Steam FAQ、下载区Steam说明、SoftwareApplication Schema |
| `rf online next coupon` | promo-codes页面 | 已在v2.1.0覆盖，标题含"Coupon Codes" |

#### Classes页面SEO升级
- **标题**：从 `{section} | {site.title}` → `RF Online Next Classes & Best Class Guide | {site.title}`
- **描述**：增加"Find the best class"长尾词
- **关键词**：从8个扩展至20个，新增：
  - `RF Online Next class`（单数形式，覆盖高搜索量）
  - `RF Online Next class guide`
  - `RF Online Next class tier list`
  - `RF Online Next class rankings`
  - 每个职业名（Arbiter/Demolisher/Phantom/Psypher/Technician/Dreadnought/Punisher/Enforcer）
  - `RF Online Next which class to pick`
  - `best class RF Online Next beginner`
- **hreflang**：新增4语言canonical alternates
- **详情页**：标题增加"Class Guide"、描述增加"Complete guide"、新增7个关键词/class

#### 首页重大更新
- **新增generateMetadata**：首页新增独立元数据，含16个目标关键词
- **新增下载与游玩区**：4平台下载卡片（Netmarble/Epic/iOS/Android），明确标注"NOT on Steam"
- **新增Steam FAQ**：针对"rf online next steam"搜索词，明确回答游戏未上架Steam
- **新增SoftwareApplication Schema**：包含安装URL和releaseNotes提及Steam不可用
- **FAQ总数**：从14个扩展至15个

#### Sitemap更新
- Classes页面优先级从0.9提升至**0.95**（匹配搜索量）
- Promo-codes页面优先级从0.9提升至**0.95**
- 职业详情页优先级从0.7提升至**0.85**
- 下载攻略优先级设为**0.9**，更新频率daily
- 新增4平台下载URL变体（?platform=参数）

#### 新增翻译键（4语言）
- `section.download` / `section.download.desc`
- `download.pc` / `download.pc.desc`
- `download.epic` / `download.epic.desc`
- `download.ios` / `download.ios.desc`
- `download.android` / `download.android.desc`
- `download.steam.note`
- `faq.steam` / `faq.steam.answer`

#### 数据统计修正
- Classes: 7 ✓（未变）
- Bosses: 5 → **5**（去掉"+"后缀）
- Items: 500+ → **365+**（修正为实际分类总计：武器140+护甲110+饰品70+塔利克25+套装20）
- Guides: 12 → **14**（新增下载安装攻略和已有攻略计数修正）
- Codes: 5 → **7**（实际有效兑换码数量）

#### Items页面大幅升级
- **武器区**：从6个扩充到10个物品，每个增加stats和source字段
- **新增护甲区**：5件4语言护甲装备（Stargazer/Tempest/Neural/Accretian/Cora）
- **新增饰品区**：5件4语言饰品（Ring of the Void/Amulet/Targeting Module/Mining Gauge/Neural Dampener）
- **塔利克区**：增加效果描述和图标
- **新增装备套装区**：3套套装含套装效果说明
- 每个物品新增**属性面板**（stats）和**获取来源**（source）
- 新增稀有度标签多语言翻译（传说/史诗/稀有）
- 新增BreadcrumbList结构化数据
- 分类汇总卡增加图标

#### Guides页面视觉优化
- **精选攻略区**：顶部3列大卡片，渐变顶边，高亮展示新手/升级/下载攻略
- **分类分组布局**：攻略按类别分组（入门/战斗/PvP/PvE/经济/职业），每类带图标和数量
- **难度标签优化**：彩色边框标签替代原badge（绿色入门/蓝色进阶/橙色高级）
- **关键词优化**：圆角标签替代原方角标签，最多展示4个关键词
- **卡片交互**：hover时边框变为主题色

#### Dungeons页面补充完善
- **新增公共采矿场策略**：Tips 5条 + Best Classes 3个 + 警告提示（4语言）
- **新增专属采矿场策略**：Tips 5条 + Best Classes 3个 + 芯片战争窗口警告（4语言）
- 所有5个副本现在都有完整的策略、推荐职业和警告

#### Bosses页面描述补充
- **新增Aba策略**：3-5人小队、50%血量召唤小怪机制、掉落信息（4语言）
- **新增Lumerias策略**：每日18:00刷新、冰霜攻击机制、冰抗推荐（4语言）
- **新增Rex策略**：6小时刷新、冲锋秒杀机制、侧面攻击技巧（4语言）
- 所有5个Boss现在都有完整的策略、奖励和Tips

#### Crafting页面大幅扩充
- **配方从5个扩充到12个**：新增神经抑制器、惩罚巨斧、星凝者战斗甲、轨道打击模块、灵力法袍、保护卷轴、经验增幅药剂
- **配方分类展示**：按武器/护甲/饰品/塔利克/圣器/消耗品分组，带分类图标汇总卡
- **稀有度和难度标签**：每个配方显示稀有度颜色标签（传说/史诗/稀有/普通）和难度标签
- **强化成功率表格**：+1到+7完整成功率、所需塔利克、风险等级（彩色标签）
- **材料采集指南**：12种关键材料的来源类型和最佳采集地点表格
- **制作FAQ**：5个常见问题（保护卷轴使用时机、材料采集最佳方法、传说装备制作、拍卖行对比、装备插槽）
- 新增hreflang多语言链接

---

### 🔍 v2.3.0 内容深度优化（2026年6月19日）

#### Classes页面大幅丰富
- **职业评级系统**：每个职业新增PvE/PvP星级评分（1-5星）、难度标签（Easy/Medium/Hard）
- **职业快速对比表**：顶部新增职业总览卡片，展示小头像、名称、Tier、PvE/PvP星评、难度
- **职业详情卡片增强**：全宽卡片布局，展示职业形象、Tier+Role标签、难度、玩法描述、PvE/PvP评分、优缺点面板
- **优缺点面板**：每个职业3-4个优点（绿色）+ 3-4个缺点（红色），4语言覆盖
- **角色定位标签**：Tank/DPS/Support/Assassin标签，按语言本地化

#### 职业详情页大幅丰富
- **新增PvE攻略**：每个职业4条PvE技巧，4语言覆盖
- **新增PvP攻略**：每个职业4条PvP技巧，4语言覆盖
- **新增最佳内容推荐**：每个职业4个最适用场景标签
- **新增职业FAQ**：每个职业3个常见问题（含折叠答案），4语言覆盖
- **PvE/PvP星级评分**：详情页展示评分星标
- **新增Article+BreadcrumbList结构化数据**

#### Bosses页面大幅丰富
- **修复ID映射**：`pit-boss-1` → `turncoat-pincher`，Turncoat Pincher策略现在正确显示
- **新增Boss掉落展示**：从game-data读取drops字段，所有Boss卡片现在展示完整掉落表
- **新增警告面板**：红色警告区展示Boss危险机制（如冲锋秒杀、冰冻锁定、增援呼叫）
- **新增推荐职业**：绿色标签展示每个Boss的最佳职业搭配
- **新增策略奖励**：区别于基础掉落，展示策略相关奖励
- **新增快速统计卡**：世界Boss/野外Boss数量汇总
- **新增CollectionPage+BreadcrumbList结构化数据**

#### Monsters页面大幅丰富
- **新增怪物描述**：9个怪物全部新增详细描述（生态、威胁等级、特征），4语言覆盖
- **新增行为模式**：每个怪物的巡逻/攻击/逃跑/特殊行为说明
- **新增刷取提示**：每个怪物4条Tips，4语言覆盖
- **新增最佳刷取推荐**：每个怪物2个推荐用途标签
- **类型图标**：普通🐺 / 精英👹 / 稀有🐉，替代原纯色标签
- **类型统计卡**：顶部3列展示普通/精英/稀有怪物数量
- **稀有度渐变布局**：普通3列 → 精英2列 → 稀有2列，强调稀有度

#### Crafting页面图标修复
- **修复多语言图标不一致**：分类图标映射新增所有本地化分类名（武器/防具/饰品/タリック/무기/방어구等），非英语页面不再显示📦默认图标

#### 修改文件清单

| 文件 | 修改类型 |
|------|----------|
| `src/app/[locale]/classes/page.tsx` | 重写：新增PvE/PvP评分、难度、优缺点、快速对比表 |
| `src/app/[locale]/classes/[classId]/page.tsx` | 重写：新增PvE/PvP攻略、最佳内容推荐、职业FAQ、评分星标 |
| `src/app/[locale]/bosses/page.tsx` | 重写：修复ID映射、新增掉落展示、警告面板、推荐职业、统计卡 |
| `src/app/[locale]/monsters/page.tsx` | 重写：新增描述、行为模式、Tips、最佳推荐、类型图标、统计卡 |
| `src/app/[locale]/crafting/page.tsx` | 修复：图标映射新增多语言分类名 |和BreadcrumbList结构化数据

#### Sacred Weapons页面大幅扩充
- **圣器对比表**：新增HP/DPS/机动性/支援能力5星评级对比，阵营颜色编码
- **升级费用表格**：每个圣器Lv1→5完整升级费用（金币/燃料/材料）
- **芯片战争定位**：每个圣器在芯片战争中的角色和战术说明
- **优缺点分析**：每个圣器5个优点+5个缺点，绿色/红色面板展示
- **圣器FAQ**：每个圣器3个常见问题（部署范围、终极技能获取、场景适配）
- 新增hreflang多语言链接
