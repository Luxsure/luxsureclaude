package com.example.screens

import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.automirrored.outlined.List
import androidx.compose.material.icons.outlined.Place
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.ui.theme.Ink
import com.example.ui.theme.Muted
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.models.LuxsureViewModel
import com.example.screens.addresses.AddressDetailScreen
import com.example.screens.addresses.AddressesScreen
import com.example.screens.categories.CategoriesScreen
import com.example.screens.destinations.DestinationsScreen
import com.example.screens.guide.GuideScreen
import com.example.screens.home.HomeScreen
import com.example.ui.theme.Gold
import com.example.ui.theme.Ivory

// Define routes
const val ROUTE_HOME = "home"
const val ROUTE_ADDRESSES = "addresses"
const val ROUTE_CATEGORIES = "categories"
const val ROUTE_DESTINATIONS = "destinations"
const val ROUTE_GUIDE = "guide"
const val ROUTE_DETAIL = "addresses/{slug}"

// Define navigation tabs
sealed class TabItem(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val testTag: String
) {
    object Home : TabItem(ROUTE_HOME, "Accueil", Icons.Filled.Home, Icons.Outlined.Home, "tab_home")
    object Addresses : TabItem(ROUTE_ADDRESSES, "Adresses", Icons.Filled.Search, Icons.Outlined.Search, "tab_addresses")
    object Categories : TabItem(ROUTE_CATEGORIES, "Catégories", Icons.AutoMirrored.Filled.List, Icons.AutoMirrored.Outlined.List, "tab_categories")
    object Destinations : TabItem(ROUTE_DESTINATIONS, "Voyages", Icons.Filled.Place, Icons.Outlined.Place, "tab_destinations")
    object Guide : TabItem(ROUTE_GUIDE, "Le Guide", Icons.Filled.Info, Icons.Outlined.Info, "tab_guide")
}

val allTabs = listOf(
    TabItem.Home,
    TabItem.Addresses,
    TabItem.Categories,
    TabItem.Destinations,
    TabItem.Guide
)

@Composable
fun MainAppShell(
    modifier: Modifier = Modifier,
    viewModel: LuxsureViewModel = viewModel()
) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    // Hide bottom bar on detail screen for full screen focus
    val showBottomBar = currentRoute != ROUTE_DETAIL

    Scaffold(
        modifier = modifier.fillMaxSize(),
        bottomBar = {
            if (showBottomBar) {
                NavigationBar(
                    containerColor = MaterialTheme.colorScheme.background,
                    tonalElevation = 8.dp,
                    windowInsets = WindowInsets.navigationBars,
                    modifier = Modifier.testTag("app_bottom_bar")
                ) {
                    allTabs.forEach { tab ->
                        val isSelected = currentRoute == tab.route || (tab.route == ROUTE_ADDRESSES && currentRoute?.startsWith(ROUTE_ADDRESSES) == true)
                        NavigationBarItem(
                            selected = isSelected,
                            onClick = {
                                if (tab.route == ROUTE_ADDRESSES) {
                                    // Reset active category filters if they click tab directly
                                    viewModel.selectCategory(null)
                                    viewModel.selectDestination(null)
                                }
                                navController.navigate(tab.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            icon = {
                                Icon(
                                    imageVector = if (isSelected) tab.selectedIcon else tab.unselectedIcon,
                                    contentDescription = tab.title,
                                    tint = if (isSelected) Ink else Muted
                                )
                            },
                            label = {
                                Text(
                                    text = tab.title,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = if (isSelected) Ink else Muted
                                )
                            },
                            colors = NavigationBarItemDefaults.colors(
                                indicatorColor = Gold.copy(alpha = 0.2f)
                            ),
                            modifier = Modifier.testTag(tab.testTag)
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = ROUTE_HOME,
            modifier = Modifier.padding(innerPadding)
        ) {
            // Screen 1: Home Dashboard
            composable(ROUTE_HOME) {
                HomeScreen(
                    viewModel = viewModel,
                    onNavigateToAddresses = { query, categorySlug, destinationSlug ->
                        viewModel.resetFilters()
                        if (query != null) viewModel.updateSearchQuery(query)
                        if (categorySlug != null) viewModel.selectCategory(categorySlug)
                        if (destinationSlug != null) viewModel.selectDestination(destinationSlug)
                        navController.navigate(ROUTE_ADDRESSES) {
                            popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                    onNavigateToAddressDetail = { slug ->
                        navController.navigate("addresses/$slug")
                    }
                )
            }

            // Screen 2: Addresses Multi-Filter Search
            composable(
                route = ROUTE_ADDRESSES,
                arguments = listOf(
                    navArgument("category") {
                        type = NavType.StringType
                        nullable = true
                        defaultValue = null
                    },
                    navArgument("destination") {
                        type = NavType.StringType
                        nullable = true
                        defaultValue = null
                    }
                )
            ) { backStackEntry ->
                val categoryArg = backStackEntry.arguments?.getString("category")
                val destinationArg = backStackEntry.arguments?.getString("destination")

                AddressesScreen(
                    viewModel = viewModel,
                    initialCategorySlug = categoryArg,
                    initialDestinationSlug = destinationArg,
                    onNavigateToAddressDetail = { slug ->
                        navController.navigate("addresses/$slug")
                    }
                )
            }

            // Screen 3: Detail View
            composable(
                route = ROUTE_DETAIL,
                arguments = listOf(
                    navArgument("slug") { type = NavType.StringType }
                )
            ) { backStackEntry ->
                val slug = backStackEntry.arguments?.getString("slug") ?: ""
                AddressDetailScreen(
                    viewModel = viewModel,
                    slug = slug,
                    onNavigateBack = { navController.popBackStack() }
                )
            }

            // Screen 4: Categories Catalog
            composable(ROUTE_CATEGORIES) {
                CategoriesScreen(
                    viewModel = viewModel,
                    onCategorySelected = { slug ->
                        viewModel.resetFilters()
                        viewModel.selectCategory(slug)
                        navController.navigate(ROUTE_ADDRESSES) {
                            popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
            }

            // Screen 5: Destinations Catalog
            composable(ROUTE_DESTINATIONS) {
                DestinationsScreen(
                    viewModel = viewModel,
                    onDestinationSelected = { slug ->
                        viewModel.resetFilters()
                        viewModel.selectDestination(slug)
                        navController.navigate(ROUTE_ADDRESSES) {
                            popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
            }

            // Screen 6: Editorial Guide Story
            composable(ROUTE_GUIDE) {
                GuideScreen()
            }
        }
    }
}
