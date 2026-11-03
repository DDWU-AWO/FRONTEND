import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getMonthlyReport } from '../api/report';
import { formatChars, formatWon, savedPercent } from '../utils/format';

const CHAR_AXIS_MAX = 400_000; // 단계별 분량 막대의 최대 눈금 (40만 자)
const CHAR_TICKS = [0, 100_000, 200_000, 300_000, 400_000];

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const Top = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap = 8 }) => $gap}px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

const Text = styled.p`
  font-size: ${({ $size = 14 }) => $size}px;
  font-weight: ${({ $weight = 400 }) => $weight};
  line-height: ${({ $lineHeight = 1.6 }) => $lineHeight};
  color: ${({ theme, $color = 'textMuted' }) => theme.colors[$color]};
  ${({ $align }) => $align && `text-align: ${$align};`}
`;

const Period = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.primary};
`;

const HeroNumbers = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const HeroItem = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  line-height: 1.6;
`;

const HeroLabel = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.onPrimaryMuted};
`;

const HeroValue = styled.p`
  font-size: ${({ $size }) => $size}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onPrimary};
`;

const HeroDivider = styled.span`
  align-self: stretch;
  width: 1px;
  background: ${({ theme }) => theme.colors.onPrimary};
  opacity: 0.18;
`;

const HeroFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  padding-top: 18px;
  border-top: 1px solid rgba(214, 220, 238, 0.3);
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.onPrimaryMuted};
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap = 24 }) => $gap}px;
  padding: ${({ $padding = 28 }) => $padding}px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const StatValue = styled.p`
  font-size: 30px;
  font-weight: 700;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
`;

const Charts = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 620fr) minmax(0, 444fr);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
`;

const Legend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const LegendItem = styled.li`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background: ${({ theme, $color }) => theme.colors[$color]};
  }
`;

const BarGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap}px;
`;

const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap = 8 }) => $gap}px;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 12px;
  overflow: hidden;
  border-radius: ${({ $radius = 3 }) => $radius}px;
  background: ${({ theme, $track }) => ($track ? theme.colors.surfaceMuted : 'transparent')};
`;

const BarFill = styled.div`
  width: ${({ $ratio }) => Math.min($ratio, 1) * 100}%;
  height: 100%;
  border-radius: ${({ $radius = 3 }) => $radius}px;
  background: ${({ theme, $color }) => theme.colors[$color]};
`;

const BarValue = styled.span`
  flex-shrink: 0;
  width: ${({ $width }) => $width}px;
  font-size: ${({ $size = 13 }) => $size}px;
  font-weight: ${({ $strong }) => ($strong ? 700 : 400)};
  line-height: 1.6;
  text-align: right;
  color: ${({ theme, $strong }) => ($strong ? theme.colors.primary : theme.colors.textMuted)};
`;

const Axis = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 84px; /* 값 표시 칸(72px) + 간격(12px) */
  font-size: 12px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SpaceBetween = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: ${({ $align = 'flex-start' }) => $align};
  justify-content: space-between;
  gap: 8px;
`;

const Total = styled(SpaceBetween)`
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    padding: 12px 16px;
    background: ${({ theme }) => theme.colors.surfaceSelected};
    font-size: 13px;
    font-weight: 500;
    line-height: 1.6;
    text-align: left;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  td {
    padding: 17px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    vertical-align: middle;
  }

  .date {
    width: 160px;
  }

  .rate {
    width: 112px;
    text-align: right;
  }
`;

/**
 * Figma: 06 절약 리포트 / 월간 요약
 * 통째로 넘겼을 때와 핵심만 넘겼을 때의 분량·비용을 비교해 보여줍니다.
 */
function ReportPage() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    let ignore = false;
    getMonthlyReport().then((data) => {
      if (!ignore) setReport(data);
    });
    return () => {
      ignore = true;
    };
  }, []);

  if (!report) return null;

  const { chars, cost } = report;
  const savedChars = chars.before - chars.after;
  const totalAgentCost = report.agents.reduce((sum, a) => sum + a.cost, 0);

  return (
    <Wrapper>
      <Top>
        <Heading>
          <Title>이만큼 아꼈어요</Title>
          <Text $size={16}>꼭 필요한 내용만 전달해서, AI가 읽는 분량과 비용을 줄였어요.</Text>
        </Heading>
        <Period>
          <Text $size={16} $weight={700} $color="text">
            {report.month}
          </Text>
          <Text $size={13}>
            {report.period}
            {report.isSample && ' · 예시 데이터'}
          </Text>
        </Period>
      </Top>

      <Hero aria-label="이번 달 절약 성과">
        <HeroNumbers>
          <HeroItem>
            <HeroLabel>이번 달 아낀 분량</HeroLabel>
            <HeroValue $size={48}>{savedPercent(chars.before, chars.after)}%</HeroValue>
          </HeroItem>
          <HeroDivider aria-hidden />
          <HeroItem>
            <HeroLabel>아낀 예상 비용</HeroLabel>
            <HeroValue $size={40}>{formatWon(cost.before - cost.after)}</HeroValue>
          </HeroItem>
        </HeroNumbers>
        <HeroFooter>
          <p>
            읽을 분량 {formatChars(chars.before)} → {formatChars(chars.after)} ·{' '}
            {formatChars(savedChars)} 절약
          </p>
          <p>
            통째로 넘겼다면 {formatWon(cost.before)} → 실제 사용 {formatWon(cost.after)}
          </p>
        </HeroFooter>
      </Hero>

      <Heading $gap={12}>
        <StatGrid>
          {[
            ['총 작업 수', `${report.totalTasks}개`, '이번 달 완료한 작업'],
            ['AI가 읽은 총 분량', formatChars(chars.after), '각 단계에서 실제로 읽은 분량의 합계'],
            ['실제 사용 비용', formatWon(cost.after), '이번 달 담당 AI 사용 비용의 합계'],
          ].map(([label, value, note]) => (
            <Card key={label} $padding={24} $gap={8}>
              <Text $size={15} $color="textSecondary">
                {label}
              </Text>
              <StatValue>{value}</StatValue>
              <Text $size={13}>{note}</Text>
            </Card>
          ))}
        </StatGrid>
        <Text $size={13}>비용은 AWO가 직접 계산한 값이라 실제 청구액과 조금 다를 수 있어요</Text>
      </Heading>

      <Charts>
        <Card aria-labelledby="chars-chart-title">
          <Heading>
            <CardTitle id="chars-chart-title">단계별로 얼마나 줄었나요?</CardTitle>
            <Text>이번 달 전체 작업에서 AI가 읽은 분량을 비교했어요.</Text>
            <Legend>
              <LegendItem $color="barBefore">통째로 넘겼다면</LegendItem>
              <LegendItem $color="primary">핵심만 넘긴 경우</LegendItem>
            </Legend>
          </Heading>
          <BarGroups $gap={20}>
            {report.steps.map((step) => (
              <BarGroup key={step.name}>
                <Text $weight={500} $color="textSecondary">
                  {step.name}
                </Text>
                <BarRow title={`${step.name} · 통째로 넘겼다면 ${formatChars(step.before)}`}>
                  <BarTrack>
                    <BarFill $ratio={step.before / CHAR_AXIS_MAX} $color="barBefore" />
                  </BarTrack>
                  <BarValue $width={72}>{formatChars(step.before)}</BarValue>
                </BarRow>
                <BarRow title={`${step.name} · 핵심만 넘긴 경우 ${formatChars(step.after)}`}>
                  <BarTrack>
                    <BarFill $ratio={step.after / CHAR_AXIS_MAX} $color="primary" />
                  </BarTrack>
                  <BarValue $width={72} $strong>
                    {formatChars(step.after)}
                  </BarValue>
                </BarRow>
              </BarGroup>
            ))}
          </BarGroups>
          <BarGroup $gap={10}>
            <Axis aria-hidden>
              {CHAR_TICKS.map((tick, i) => (
                <span key={tick}>
                  {tick === 0
                    ? '0'
                    : formatChars(tick, { unit: i === CHAR_TICKS.length - 1 })}
                </span>
              ))}
            </Axis>
            <Text $size={12}>분량은 공백을 포함한 글자 수예요. 1만 자는 10,000글자예요.</Text>
          </BarGroup>
        </Card>

        <Card aria-labelledby="cost-chart-title">
          <Heading>
            <CardTitle id="cost-chart-title">담당 AI별 비용 비중</CardTitle>
            <Text>실제 사용 비용 {formatWon(totalAgentCost)}을 나눠 봤어요.</Text>
            <Legend>
              <LegendItem $color="primary">실제 사용 비용에서 차지하는 비중</LegendItem>
            </Legend>
          </Heading>
          <BarGroups $gap={26}>
            {report.agents.map((agent) => {
              const share = agent.cost / totalAgentCost;
              return (
                <BarGroup key={agent.name} $gap={10}>
                  <SpaceBetween>
                    <Text $weight={500} $color="textSecondary">
                      {agent.name}
                    </Text>
                    <Text $color="textSecondary">{formatWon(agent.cost)}</Text>
                  </SpaceBetween>
                  <BarRow title={`${agent.name} · ${Math.round(share * 100)}%`}>
                    <BarTrack $track $radius={4}>
                      <BarFill $ratio={share} $color="primary" $radius={4} />
                    </BarTrack>
                    <BarValue $width={48} $size={14} $strong>
                      {Math.round(share * 100)}%
                    </BarValue>
                  </BarRow>
                </BarGroup>
              );
            })}
          </BarGroups>
          <Total>
            <Text $weight={500} $color="textSecondary">
              합계 · 100%
            </Text>
            <Text $weight={700} $color="text">
              {formatWon(totalAgentCost)}
            </Text>
          </Total>
        </Card>
      </Charts>

      <Card $gap={20} aria-labelledby="recent-title">
        <SpaceBetween $align="center">
          <Heading $gap={6}>
            <CardTitle id="recent-title">최근 작업별 절약률</CardTitle>
            <Text>어떤 일을 맡겼고, 읽을 분량을 얼마나 아꼈는지 확인해 보세요.</Text>
          </Heading>
          <Text $size={13}>
            이번 달 완료한 {report.totalTasks}개 중 최근 {report.recentTasks.length}개
          </Text>
        </SpaceBetween>
        <Table>
          <thead>
            <tr>
              <th scope="col">요청 / 제목</th>
              <th scope="col" className="date">
                완료 날짜
              </th>
              <th scope="col" className="rate">
                분량 절약률
              </th>
            </tr>
          </thead>
          <tbody>
            {report.recentTasks.map((task) => (
              <tr key={task.title}>
                <td>
                  <Heading $gap={4}>
                    <Text $size={15} $weight={500} $color="text">
                      {task.title}
                    </Text>
                    <Text $size={13}>{task.summary}</Text>
                  </Heading>
                </td>
                <td className="date">
                  <Text>{task.completedAt}</Text>
                </td>
                <td className="rate">
                  <Text $size={18} $weight={700} $color="primary">
                    {task.savedPercent}%
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Text $size={12}>
          절약률은 내용을 통째로 넘겼을 때와 비교해 줄어든 분량이에요. 이번 달 수치는 전체{' '}
          {report.totalTasks}개 작업을 합쳐 계산했어요.
        </Text>
      </Card>
    </Wrapper>
  );
}

export default ReportPage;
