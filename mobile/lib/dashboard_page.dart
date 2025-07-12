import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'auth_service.dart';
import 'main.dart';

class DashboardPage extends StatelessWidget {
  final Map<String, dynamic> userInfo;
  
  const DashboardPage({super.key, required this.userInfo});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Trackademic Dashboard',
          style: GoogleFonts.inter(
            fontWeight: FontWeight.w600,
            color: const Color(0xFF0B3948),
          ),
        ),
        backgroundColor: const Color(0xFFD9DBF1),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(
              Icons.logout,
              color: Color(0xFF0B3948),
            ),
            onPressed: () => _signOut(context),
          ),
        ],
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFD9DBF1), // Light lavender
              Color(0xFFD0CDD7), // Light gray-purple
              Color(0xFFACB0BD), // Medium gray-blue
            ],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Welcome Section
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 10,
                        offset: const Offset(0, 5),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 60,
                            height: 60,
                            decoration: BoxDecoration(
                              color: const Color(0xFF416165),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(
                              Icons.person,
                              color: Colors.white,
                              size: 30,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Welcome back!',
                                  style: GoogleFonts.inter(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: const Color(0xFF0B3948),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  userInfo['displayName'] ?? 'User',
                                  style: GoogleFonts.inter(
                                    fontSize: 16,
                                    color: const Color(0xFF416165),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      const Divider(color: Color(0xFFACB0BD)),
                      const SizedBox(height: 16),
                      _buildUserInfoRow('Email', userInfo['email'] ?? 'N/A'),
                      const SizedBox(height: 8),
                      _buildUserInfoRow('User ID', userInfo['id'] ?? 'N/A'),
                      const SizedBox(height: 8),
                      _buildUserInfoRow('Role', 'Loading...'), // TODO: Get from Graph API
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                
                // Quick Actions
                Text(
                  'Quick Actions',
                  style: GoogleFonts.inter(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF0B3948),
                  ),
                ),
                const SizedBox(height: 16),
                
                // Action Cards
                Expanded(
                  child: GridView.count(
                    crossAxisCount: 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    children: [
                      _buildActionCard(
                        icon: Icons.assignment,
                        title: 'Assignments',
                        subtitle: 'View your tasks',
                        onTap: () {
                          // TODO: Navigate to assignments
                        },
                      ),
                      _buildActionCard(
                        icon: Icons.schedule,
                        title: 'Schedule',
                        subtitle: 'Check timetable',
                        onTap: () {
                          // TODO: Navigate to schedule
                        },
                      ),
                      _buildActionCard(
                        icon: Icons.group,
                        title: 'Groups',
                        subtitle: 'Manage groups',
                        onTap: () {
                          // TODO: Navigate to groups
                        },
                      ),
                      _buildActionCard(
                        icon: Icons.analytics,
                        title: 'Progress',
                        subtitle: 'Track progress',
                        onTap: () {
                          // TODO: Navigate to progress
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildUserInfoRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 80,
          child: Text(
            '$label:',
            style: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: const Color(0xFF416165),
            ),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: GoogleFonts.inter(
              fontSize: 14,
              color: const Color(0xFF0B3948),
            ),
          ),
        ),
      ],
    );
  }
  
  Widget _buildActionCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 40,
              color: const Color(0xFF416165),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF0B3948),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: GoogleFonts.inter(
                fontSize: 12,
                color: const Color(0xFF416165),
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
  
  Future<void> _signOut(BuildContext context) async {
    await AuthService.signOut();
    if (context.mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (context) => const TrackademicApp(),
        ),
      );
    }
  }
}
