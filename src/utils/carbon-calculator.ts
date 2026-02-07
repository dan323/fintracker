import { Transaction } from "../models/transaction";
import { findCategoryByName, subCategories } from "./categories";
import { categories, FlatCategory, getRegionalAdjustment } from "../models/categories";

export interface CarbonBreakdown {
  category: string;
  emissions: number;
  percentage: number;
}

export interface CarbonAnalysis {
  totalEmissions: number;
  monthlyAverage: number;
  breakdown: CarbonBreakdown[];
  recommendations: string[];
  region: string;
}

export class CarbonCalculator {
  /**
   * Calculate emissions for a single transaction
   */
  static calculateTransactionEmission(transaction: Transaction, region: string = 'EU'): number {
    // Only calculate emissions for expenses
    if (transaction.amount >= 0) return 0;
    
    const category = findCategoryByName(transaction.category) || categories["miscellaneous-others"];
    const baseEmission = this.calculateCategoryEmission(category, Math.abs(transaction.amount));
    
    // Apply regional adjustment
    const regionalAdjustment = getRegionalAdjustment(category.id, region);
    return baseEmission * regionalAdjustment;
  }

  /**
   * Calculate emissions for a category and amount
   */
  private static calculateCategoryEmission(category: FlatCategory, amount: number): number {
    if (category.emissionFactor !== undefined) {
      return amount * category.emissionFactor;
    }
    
    // Calculate from subcategories
    const subCats = subCategories(category);
    if (subCats.length === 0) return 0;
    
    return subCats.reduce((total, sub) => {
      const proportion = sub.proportion || (1 / subCats.length); // Equal distribution if no proportion
      const subAmount = amount * proportion;
      
      if (sub.emissionFactor !== undefined) {
        return total + subAmount * sub.emissionFactor;
      } else {
        return total + this.calculateCategoryEmission(sub, subAmount);
      }
    }, 0);
  }

  /**
   * Analyze carbon footprint for all transactions
   */
  static analyzeFootprint(transactions: Transaction[], region: string = 'EU'): CarbonAnalysis {
    const categoryEmissions = new Map<string, number>();
    let totalEmissions = 0;

    // Calculate emissions by category
    transactions.forEach(tx => {
      if (tx.amount >= 0) return; // Skip income
      
      const emission = this.calculateTransactionEmission(tx);
      totalEmissions += emission;
      
      const category = findCategoryByName(tx.category)?.name || 'Others';
      categoryEmissions.set(category, (categoryEmissions.get(category) || 0) + emission);
    });

    // Create breakdown
    const breakdown: CarbonBreakdown[] = Array.from(categoryEmissions.entries())
      .map(([category, emissions]) => ({
        category,
        emissions,
        percentage: totalEmissions > 0 ? (emissions / totalEmissions) * 100 : 0
      }))
      .sort((a, b) => b.emissions - a.emissions);

    // Calculate monthly average
    const uniqueMonths = new Set(
      transactions.map(tx => {
        const date = new Date(tx.date);
        return `${date.getFullYear()}-${date.getMonth()}`;
      })
    ).size;
    
    const monthlyAverage = uniqueMonths > 0 ? totalEmissions / uniqueMonths : 0;

    // Generate recommendations
    const recommendations = this.generateRecommendations(breakdown, totalEmissions, region);

    return {
      totalEmissions,
      monthlyAverage,
      breakdown,
      recommendations,
      region
    };
  }

  /**
   * Generate personalized recommendations
   */
  private static generateRecommendations(breakdown: CarbonBreakdown[], total: number, region: string): string[] {
    const recommendations: string[] = [];
    
    if (total === 0) return ['No hay datos suficientes para generar recomendaciones.'];

    if (region === 'NO' || region === 'FR') {
      recommendations.push('Tu región tiene una red eléctrica relativamente limpia. Considera la electrificación del transporte y calefacción.');
    } else if (region === 'PL' || region === 'DE') {
      recommendations.push('Tu región aún depende de combustibles fósiles. Prioriza la eficiencia energética y considera energía solar doméstica.');
    }
    // Find top emission categories
    const topCategories = breakdown.slice(0, 3);
    
    topCategories.forEach(({ category, percentage }) => {
      if (percentage > 20) {
        switch (category.toLowerCase()) {
          case 'transport':
            if (region === 'NO' || region === 'FR') {
              recommendations.push('Con tu red eléctrica limpia, cambiar a un vehículo eléctrico tendría un gran impacto positivo.');
            } else {
              recommendations.push('Considera transporte público, caminar, bicicleta, o carpooling para reducir emisiones de transporte.');
            }
          break;
          case 'transportation':
            recommendations.push('Considera usar transporte público o vehículos eléctricos para reducir emisiones de transporte.');
            break;
          case 'food and dining':
          case 'food & dining':
          case 'restaurant':
            recommendations.push('Reduce el consumo de carne y opta por opciones vegetarianas/veganas más frecuentemente.');
            break;
          case 'housing and utilities':
          case 'utilities':
            if (region === 'PL' || region === 'CN') {
              recommendations.push('Tu red eléctrica es intensiva en carbón. Prioriza la eficiencia energética y considera paneles solares.');
            } else {
              recommendations.push('Mejora la eficiencia energética de tu hogar y considera cambiar a un proveedor de energía renovable.');
            }
            break;
          case 'bills & utilities':
            recommendations.push('Considera cambiar a energía renovable y mejora la eficiencia energética de tu hogar.');
            break;
          case 'shopping':
          case 'retail':
            recommendations.push('Compra productos de marcas sostenibles y reduce el consumo de fast fashion.');
            break;
          case 'travel':
            recommendations.push('Opta por destinos más cercanos o compensa las emisiones de tus viajes largos.');
            break;
          default:
            recommendations.push(`Revisa tus gastos en ${category} para identificar oportunidades de reducción de emisiones.`);
        }
      }
    });

    // General recommendations based on total emissions
    if (total > 1000) {
      recommendations.push('Tu huella de carbono está por encima del promedio. Considera implementar cambios en las categorías con mayores emisiones.');
    } else if (total > 500) {
      recommendations.push('Tu huella de carbono es moderada. Pequeños cambios pueden generar un gran impacto.');
    } else {
      recommendations.push('¡Excelente! Tu huella de carbono es relativamente baja. Mantén estos hábitos sostenibles.');
    }

    return recommendations.length > 0 ? recommendations : ['Continúa monitoreando tus gastos para identificar oportunidades de reducción de emisiones.'];
  }
}