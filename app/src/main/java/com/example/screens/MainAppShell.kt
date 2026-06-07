package com.example.screens

import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.*
import androidx.navigation.compose.*
import com.example.models.LuxsureViewModel
import com.example.screens.addresses.AddressDetailScreen
import com.example.screens.addresses.AddressesScreen
import com.example.screens.guide.GuideScreen
import com.example.screens.home.HomeScreen
import com.example.ui.theme.Gold
import com.example.ui.theme.Ink
import com.example.ui.theme.Ivory
import com.example.ui.theme.Line
import com.example.ui.theme.Muted

private enum class TopLevel(val route: String, val label: String, val icon: ImageVector) {
    HOME("home", "Accueil", Icons.Filled.Home),
    ADDRESSES("addresses", "Explorer", Icons.Filled.List),
    GUIDE("guide", "Guide", Icons.Filled.Bookmark),
}

private const val ADDRESSES_ROUTE =
    "addresses?query={query}&category={category}&destination={destination}"
private const val DETAIL_ROUTE = "addressDetail/{slug}"

@Composable
fun MainAppShell(viewModel: LuxsureViewModel = viewModel()) {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route

    val isTopLevel = TopLevel.entries.any { currentRoute?.startsWith(it.route) == true }

    Scaffold(
        bottomBar = {
            if (isTopLevel) {
                NavigationBar(
                    containerColor = Ivory,
                    tonalElevation = 0.dp
                ) {
                    TopLevel.entries.forEach { item ->
                        val selected = currentRoute?.startsWith(item.route) == true
                        NavigationBarItem(
                            selected = selected,
                            onClick = {
                                if (!selected) {
                                    navController.navigate(item.route) {
                                        popUpTo(navController.graph.startDestinationId) {
                                            saveState = true
                                        }
                                        launchSingleTop = true
                                        restoreState = true
                                    }
                                }
                            },
                            icon = {
                                Icon(
                                    imageVector = item.icon,
                                    contentDescription = item.label,
                                    modifier = Modifier.size(20.dp)
                                )
                            },
                            label = {
                                Text(
                                    text = item.label,
                                    style = MaterialTheme.typography.labelSmall
                                )
                            },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = Ink,
                                selectedTextColor = Gold,
                                indicatorColor = Line.copy(alpha = 0.4f),
                                unselectedIconColor = Muted,
                                unselectedTextColor = Muted
                            )
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = TopLevel.HOME.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(TopLevel.HOME.route) {
                HomeScreen(
                    viewModel = viewModel,
                    onNavigateToAddresses = { query, category, destination ->
                        navController.navigate(buildAddressRoute(query, category, destination))
                    },
                    onNavigateToAddressDetail = { slug ->
                        navController.navigate("addressDetail/$slug")
                    }
                )
            }

            composable(
                route = ADDRESSES_ROUTE,
                arguments = listOf(
                    navArgument("query") { nullable = true; defaultValue = null },
                    navArgument("category") { nullable = true; defaultValue = null },
                    navArgument("destination") { nullable = true; defaultValue = null }
                )
            ) { back ->
                AddressesScreen(
                    viewModel = viewModel,
                    initialQuery = back.arguments?.getString("query"),
                    initialCategorySlug = back.arguments?.getString("category"),
                    initialDestinationSlug = back.arguments?.getString("destination"),
                    onNavigateToAddressDetail = { slug ->
                        navController.navigate("addressDetail/$slug")
                    }
                )
            }

            composable(
                route = DETAIL_ROUTE,
                arguments = listOf(navArgument("slug") { type = NavType.StringType })
            ) { back ->
                val slug = back.arguments?.getString("slug") ?: return@composable
                AddressDetailScreen(
                    viewModel = viewModel,
                    slug = slug,
                    onNavigateBack = { navController.popBackStack() }
                )
            }

            composable(TopLevel.GUIDE.route) {
                GuideScreen()
            }
        }
    }
}

private fun buildAddressRoute(query: String?, category: String?, destination: String?): String {
    val params = buildList {
        query?.let { add("query=$it") }
        category?.let { add("category=$it") }
        destination?.let { add("destination=$it") }
    }
    return if (params.isEmpty()) TopLevel.ADDRESSES.route
    else "${TopLevel.ADDRESSES.route}?${params.joinToString("&")}"
}
