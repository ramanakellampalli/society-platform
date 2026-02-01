import { prisma } from '../src/index';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Try a simple query
    const societyCount = await prisma.society.count();
    console.log(`✅ Query successful! Societies in database: ${societyCount}`);
    
    // Test creating a society
    console.log('\nCreating test society...');
    const testSociety = await prisma.society.create({
      data: {
        name: 'Test Society',
        address: '123 Test Street',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        totalFlats: 50,
        maintenanceAmount: 5000,
        billingCycle: 'MONTHLY',
      },
    });
    console.log('✅ Society created:', testSociety);
    
    // Clean up - delete test society
    await prisma.society.delete({
      where: { id: testSociety.id },
    });
    console.log('✅ Test society deleted (cleanup)');
    
    console.log('\n🎉 All tests passed! Database is working perfectly.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();