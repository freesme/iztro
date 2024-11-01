import { getHeavenlyStemAndEarthlyBranchBySolarDate } from 'lunar-lite';
import { initStars } from '.';
import { StarName, t } from '../i18n';
import { fixLunarMonthIndex, getBrightness, getMutagen } from '../utils';
import FunctionalStar from './FunctionalStar';
import {
  getChangQuIndex,
  getHuoLingIndex,
  getKongJieIndex,
  getKuiYueIndex,
  getLuYangTuoMaIndex,
  getZuoYouIndex,
} from './location';
import { getConfig } from '../astro';
import { StarType } from '../data/types';

/**
 * 安14辅星，寅宫下标为0，若下标对应的数组为空数组则表示没有星耀
 *
 * @param solarDateStr 阳历日期字符串
 * @param timeIndex 时辰索引【0～12】
 * @param fixLeap 是否修复闰月，假如当月不是闰月则不生效
 * @returns 14辅星
 */
export const getMinorStar = (solarDateStr: string, timeIndex: number, fixLeap?: boolean) => {
  const stars = initStars();
  const { yearly } = getHeavenlyStemAndEarthlyBranchBySolarDate(solarDateStr, timeIndex, {
    year: getConfig().yearDivide,
  });
  const monthIndex = fixLunarMonthIndex(solarDateStr, timeIndex, fixLeap);

  // 此处获取到的是索引，下标是从0开始的，所以需要加1
  const { zuoIndex, youIndex } = getZuoYouIndex(monthIndex + 1);
  const { changIndex, quIndex } = getChangQuIndex(timeIndex);
  const { kuiIndex, yueIndex } = getKuiYueIndex(yearly[0]);
  const { huoIndex, lingIndex } = getHuoLingIndex(yearly[1], timeIndex);
  const { kongIndex, jieIndex } = getKongJieIndex(timeIndex);
  const { luIndex, yangIndex, tuoIndex, maIndex } = getLuYangTuoMaIndex(yearly[0], yearly[1]);

  const starData = [
    { index: zuoIndex, name: 'zuofuMin', type: 'soft', chineseName: '左辅' },
    { index: youIndex, name: 'youbiMin', type: 'soft', chineseName: '右弼' },
    { index: changIndex, name: 'wenchangMin', type: 'soft', chineseName: '文昌' },
    { index: quIndex, name: 'wenquMin', type: 'soft', chineseName: '文曲' },
    { index: kuiIndex, name: 'tiankuiMin', type: 'soft', chineseName: '天魁' },
    { index: yueIndex, name: 'tianyueMin', type: 'soft', chineseName: '天钺' },
    { index: luIndex, name: 'lucunMin', type: 'lucun', chineseName: '禄存' },
    { index: maIndex, name: 'tianmaMin', type: 'tianma', chineseName: '天马' },
    { index: kongIndex, name: 'dikongMin', type: 'tough', chineseName: '地空' },
    { index: jieIndex, name: 'dijieMin', type: 'tough', chineseName: '地劫' },
    { index: huoIndex, name: 'huoxingMin', type: 'tough', chineseName: '火星' },
    { index: lingIndex, name: 'lingxingMin', type: 'tough', chineseName: '铃星' },
    { index: yangIndex, name: 'qingyangMin', type: 'tough', chineseName: '擎羊' },
    { index: tuoIndex, name: 'tuoluoMin', type: 'tough', chineseName: '陀罗' },
  ];

  starData.forEach(({ index, name, type, chineseName }) => {
    stars[index].push(
      new FunctionalStar({
        name: t(name),
        type: type as StarType,
        scope: 'origin',
        brightness: getBrightness(chineseName as StarName, index),
        mutagen: type !== 'lucun' && type !== 'tianma' ? getMutagen(chineseName as StarName, yearly[0]) : undefined,
      }),
    );
  });

  return stars;
};
