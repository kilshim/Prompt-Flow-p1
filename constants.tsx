import React from 'react';
import { 
  Zap, 
  BrainCircuit, 
  Copy, 
  UserRound, 
  Heart, 
  Undo2,
  FileText,
  Megaphone,
  PenTool,
  Mail,
  BarChart3,
  CircleHelp,
  Youtube,
  Trophy,
  MessageSquareQuote,
  MessageCircle,
  Newspaper
} from 'lucide-react';
import { TechniqueType, TechniqueInfo, PresetTemplate } from './types';

export const TECHNIQUES: TechniqueInfo[] = [
  {
    type: TechniqueType.ZERO_SHOT,
    title: '직설적인 요청',
    subtitle: 'Zero-shot',
    description: '추가 설명 없이 바로 과제를 지시합니다.',
    icon: 'Zap',
    effect: '간단하고 명확한 작업에 적합합니다.',
    detail: {
      concept: "AI에게 아무런 사전 정보나 예시를 주지 않고 바로 정답을 요구하는 가장 기본적인 방법입니다. AI가 이미 학습한 방대한 지식에 의존합니다.",
      example: "실례: '블로그 포스팅을 위한 제목 5개를 지어줘'라고 요청하는 것입니다. 별도의 규칙 없이 AI의 직관에 맡길 때 사용합니다."
    }
  },
  {
    type: TechniqueType.COT,
    title: '단계별 사고',
    subtitle: 'Chain of Thought',
    description: '논리적인 단계를 거쳐 결론에 도달하게 합니다.',
    icon: 'BrainCircuit',
    effect: '복잡한 문제 해결과 논리적 추론이 필요할 때 좋습니다.',
    detail: {
      concept: "AI에게 '단계별로 생각하라'고 지시하여 논리적 비약을 방지하는 기법입니다. 결과만 내놓는 것이 아니라 그 과정을 스스로 짚어보게 합니다.",
      example: "실례: 어려운 수학 문제나 복잡한 마케팅 전략을 짤 때 '먼저 시장을 분석하고, 그 다음 경쟁사를 파악한 뒤, 마지막으로 우리의 강점을 찾아줘'라고 단계를 나누어 요청하는 방식입니다."
    }
  },
  {
    type: TechniqueType.FEW_SHOT,
    title: '예시 기반 학습',
    subtitle: 'Few-shot',
    description: '원하는 결과물의 예시를 제공하여 패턴을 학습시킵니다.',
    icon: 'Copy',
    effect: '특정한 출력 형식이나 스타일을 유지해야 할 때 강력합니다.',
    detail: {
      concept: "결과물의 샘플(예시)을 1~3개 정도 보여주고 '이런 식으로 만들어줘'라고 지시하는 기법입니다. AI가 원하는 출력 형식을 정확히 파악하게 됩니다.",
      example: "실례: '리뷰를 한 줄로 요약해줘. 예시: 배송이 빨라요 -> 배송만족. 품질이 좋아요 -> 품질만족. 디자인이 예뻐요 -> ?' 와 같이 패턴을 보여주는 방식입니다."
    }
  },
  {
    type: TechniqueType.ROLE,
    title: '전문가 페르소나',
    subtitle: 'Role Prompting',
    description: 'AI에게 특정한 직업이나 관점을 부여합니다.',
    icon: 'UserRound',
    effect: '전문적인 지식이나 특유의 문체가 필요할 때 효과적입니다.',
    detail: {
      concept: "AI에게 특정 인물이나 전문가의 역할을 부여하여 그 분야 특유의 지식과 말투를 사용하게 만드는 기법입니다.",
      example: "실례: '너는 10년 차 베테랑 카피라이터야'라고 설정하면 일반적인 문장이 아니라 훨씬 자극적이고 전문적인 광고 문구를 얻을 수 있습니다."
    }
  },
  {
    type: TechniqueType.EMOTION,
    title: '감성 및 톤앤매너',
    subtitle: 'Emotional Context',
    description: '출력물의 감정 상태나 태도를 지정합니다.',
    icon: 'Heart',
    effect: '마케팅 카피나 공감형 콘텐츠 작성에 필수적입니다.',
    detail: {
      concept: "단순한 정보 전달을 넘어, AI에게 특정 감정이나 태도를 가지고 글을 쓰게 하여 독자의 마음을 움직이는 기법입니다.",
      example: "실례: '실패한 사람들을 위로하는 따뜻한 편지 형식으로 써줘' 또는 '당장 사지 않으면 손해일 것 같은 아주 긴박한 어조로 광고를 써줘'라고 요청하는 것입니다."
    }
  },
  {
    type: TechniqueType.STEP_BACK,
    title: '상위 목표 설정',
    subtitle: 'Step-back',
    description: '문제를 풀기 전 근본적인 원리와 목표를 먼저 정의합니다.',
    icon: 'Undo2',
    effect: '전략적 사고가 필요한 기획 및 분석 작업에 유리합니다.',
    detail: {
      concept: "구체적인 문제로 들어가기 전에, 한 걸음 물러나(Step-back) 이 작업의 본질적인 목표나 원칙을 먼저 생각하게 한 뒤 작업을 수행하는 고도의 기법입니다.",
      example: "실례: '광고 문구를 써줘' 대신 '광고를 쓰는 이유는 고객의 신뢰를 얻기 위함이야. 이 원칙을 바탕으로 신뢰감이 느껴지는 문구를 써줘'라고 본질을 먼저 짚어주는 방식입니다."
    }
  }
];

export const PRESETS: PresetTemplate[] = [
  { id: 'desc', name: '제품 상세페이지', task: '이 제품의 매력을 극대화하는 2000자 분량의 상세페이지 초안 작성', icon: 'FileText' },
  { id: 'ad', name: 'SNS 광고 카피', task: '인스타그램/페이스북용 클릭을 부르는 짧고 강렬한 광고 문구 5종 생성', icon: 'Megaphone' },
  { id: 'blog', name: '블로그 포스팅', task: '정보 전달과 재미를 동시에 잡는 검색 엔진 최적화(SEO) 블로그 글 작성', icon: 'PenTool' },
  { id: 'email', name: '뉴스레터/메일', task: '구독자의 행동을 유도하는 친근한 톤의 뉴스레터 본문 작성', icon: 'Mail' },
  { id: 'report', name: '성과 요약 보고서', task: '주요 특징과 수치를 바탕으로 한 눈에 들어오는 성과 보고서 정리', icon: 'BarChart3' },
  { id: 'faq', name: 'FAQ 리스트', task: '잠재 고객이 궁금해할 만한 핵심 질문(FAQ) 10가지와 전문적인 답변 작성', icon: 'CircleHelp' },
  { id: 'youtube', name: '유튜브 스크립트', task: '초반 5초에 시청자를 사로잡는 오프닝과 핵심 내용을 담은 영상 스크립트', icon: 'Youtube' },
  { id: 'slogan', name: '브랜드 슬로건', task: '브랜드의 가치를 한 문장으로 관통하는 임팩트 있는 슬로건 10선 추천', icon: 'Trophy' },
  { id: 'review_reply', name: '리뷰 답글', task: '구매 고객의 정성 어린 리뷰에 대해 진심을 담은 감사와 재구매 유도 답글 작성', icon: 'MessageSquareQuote' },
  { id: 'yt_comment', name: '유튜브 댓글', task: '영상 업로드 후 시청자의 참여를 유도하는 매력적인 고정 댓글 가이드 작성', icon: 'MessageCircle' },
  { id: 'press', name: '보도자료', task: '언론 홍보를 위한 신뢰감 있고 격식 있는 신제품 출시 보도자료 초안 작성', icon: 'Newspaper' }
];

export const getIcon = (name: string, className?: string) => {
  const icons: Record<string, any> = {
    Zap: <Zap className={className} />,
    BrainCircuit: <BrainCircuit className={className} />,
    Copy: <Copy className={className} />,
    UserRound: <UserRound className={className} />,
    Heart: <Heart className={className} />,
    Undo2: <Undo2 className={className} />,
    FileText: <FileText className={className} />,
    Megaphone: <Megaphone className={className} />,
    PenTool: <PenTool className={className} />,
    Mail: <Mail className={className} />,
    BarChart3: <BarChart3 className={className} />,
    CircleHelp: <CircleHelp className={className} />,
    Youtube: <Youtube className={className} />,
    Trophy: <Trophy className={className} />,
    MessageSquareQuote: <MessageSquareQuote className={className} />,
    MessageCircle: <MessageCircle className={className} />,
    Newspaper: <Newspaper className={className} />
  };
  return icons[name] || <Zap className={className} />;
};

export const ROLES = ['마케터', '브랜드 전략가', '소설가', '데이터 분석가', '고객 만족 상담원', '심리학자', '경제 전문가', '직접 입력'];
export const EMOTIONS = ['따뜻하고 친근한', '차갑고 논리적인', '급박하고 강렬한', '고급스럽고 우아한', '유머러스하고 재기발랄한', '신뢰감 있는'];