// Test script to verify API caching performance
import { getDashboardDataBatchApi, getForeignersApi, getSecurityMetricsApi, getGrievancesApi } from './apiService.js';

// Test API caching performance
const testApiCaching = async () => {
  console.log('🧪 Starting API performance test...\n');
  
  const startTime = Date.now();
  
  // Test 1: Dashboard batch API (should make actual network calls)
  console.log('Test 1: First dashboard batch call...');
  const start1 = Date.now();
  await getDashboardDataBatchApi();
  const time1 = Date.now() - start1;
  console.log(`✅ First call took: ${time1}ms`);
  
  // Test 2: Same dashboard batch API (should use cache)
  console.log('\nTest 2: Second dashboard batch call (cached)...');
  const start2 = Date.now();
  await getDashboardDataBatchApi();
  const time2 = Date.now() - start2;
  console.log(`✅ Second call took: ${time2}ms (cached)`);
  
  // Test 3: Individual API calls
  console.log('\nTest 3: Individual API calls...');
  const start3 = Date.now();
  await Promise.all([
    getForeignersApi(),
    getSecurityMetricsApi(),
    getGrievancesApi()
  ]);
  const time3 = Date.now() - start3;
  console.log(`✅ Individual calls took: ${time3}ms`);
  
  // Test 4: Same individual calls (should use cache)
  console.log('\nTest 4: Individual calls (cached)...');
  const start4 = Date.now();
  await Promise.all([
    getForeignersApi(),
    getSecurityMetricsApi(),
    getGrievancesApi()
  ]);
  const time4 = Date.now() - start4;
  console.log(`✅ Individual cached calls took: ${time4}ms`);
  
  const totalTime = Date.now() - startTime;
  console.log(`\n📊 Performance Summary:`);
  console.log(`- Dashboard batch first call: ${time1}ms`);
  console.log(`- Dashboard batch cached call: ${time2}ms`);
  console.log(`- Individual calls first time: ${time3}ms`);
  console.log(`- Individual calls cached: ${time4}ms`);
  console.log(`- Total test time: ${totalTime}ms`);
  
  // Performance validation
  const cacheEfficiency = ((time1 - time2) / time1 * 100).toFixed(1);
  console.log(`\n🎯 Caching efficiency: ${cacheEfficiency}% improvement`);
  
  if (time2 < 50 && time4 < 50) {
    console.log('✅ API caching is working correctly!');
  } else {
    console.log('⚠️  API caching may need optimization');
  }
};

// Run the test
if (typeof window !== 'undefined') {
  window.testApiPerformance = testApiCaching;
} else {
  testApiCaching().catch(console.error);
}
