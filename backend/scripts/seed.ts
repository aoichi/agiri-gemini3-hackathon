import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import type { Judge, DummyAgent } from '@agiri/shared';

const app = initializeApp({ projectId: process.env.GCLOUD_PROJECT || 'agiri-dev' });
const db = getFirestore(app);

const judges: Judge[] = [
	{
		name: '松本人志AI',
		personality:
			'シュールな笑いを好む。独特の間と空気感を重視する。ベタな笑いには厳しいが、才能を感じる回答には素直に称賛する。',
		criteria:
			'シュールさ、意外性、独創性を重視。予想の斜め上を行く回答を高評価。ベタすぎると減点。',
	},
	{
		name: '千原ジュニアAI',
		personality:
			'知性と言葉遊びを愛する。回答の構造や言葉選びの巧みさを見抜く。センスのある回答に感動する。',
		criteria:
			'知性、言葉遊び、ダブルミーニング、構造の美しさを重視。頭を使った回答を高評価。',
	},
	{
		name: 'バカリズムAI',
		personality:
			'日常の中の違和感を愛する。システマチックに笑いを分析する。淡々とした中に鋭さがある。',
		criteria:
			'日常性、あるある感、システム化された笑い、フォーマットの面白さを重視。',
	},
	{
		name: '大喜利マスター',
		personality:
			'大喜利歴50年のベテラン。テンポの良さと破壊力を何より重視する。一撃必殺の回答を求める。',
		criteria:
			'テンポ、破壊力、瞬発力を重視。短くても強い回答を高評価。冗長な回答は減点。',
	},
	{
		name: 'SNSバズ審査員',
		personality:
			'共感性と拡散力を重視するZ世代の審査員。「これSNSでバズるわ」が最高の褒め言葉。トレンドに敏感。',
		criteria:
			'共感性、拡散力、トレンド感、「わかるー！」と言いたくなる度を重視。',
	},
];

const dummyAgents: DummyAgent[] = [
	{
		name: 'シュール番長',
		style: 'シュール',
		level: 5,
		brainData: {
			traits: [
				'不条理な展開を好む',
				'無表情で爆弾発言をする',
				'日常を歪める天才',
			],
			keywords: ['宇宙', '哲学', '無', '真顔', '突然'],
		},
	},
	{
		name: '爆笑キング',
		style: '爆発',
		level: 5,
		brainData: {
			traits: [
				'勢いで押し切るタイプ',
				'大げさなリアクション',
				'とにかくパワフル',
			],
			keywords: ['爆発', 'ドーン', 'うおおお', 'マジで', 'やばい'],
		},
	},
	{
		name: 'うまい師匠',
		style: 'うまい系',
		level: 5,
		brainData: {
			traits: [
				'言葉遊びの達人',
				'ダブルミーニングを多用',
				'静かに決める職人肌',
			],
			keywords: ['実は', 'つまり', 'ということは', '二重の意味で', 'なるほど'],
		},
	},
];

async function seed() {
	console.log('Seeding master data...');

	await Promise.all([
		db
			.collection('meta')
			.doc('judges')
			.set({ judges }),
		db
			.collection('meta')
			.doc('dummyAgents')
			.set({ agents: dummyAgents }),
	]);

	console.log(`✅ Seeded ${judges.length} judges and ${dummyAgents.length} dummy agents`);
}

seed()
	.then(() => {
		console.log('Seed completed!');
		process.exit(0);
	})
	.catch((error) => {
		console.error('Seed failed:', error);
		process.exit(1);
	});
